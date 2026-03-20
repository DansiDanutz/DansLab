// ============================================================================
// OpenClaw Logger — System Information Collector
// ============================================================================

import * as os from 'os';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { SystemMetricsEntry, ProcessInfo } from './types';

export function getSystemInfo() {
  const cpus = os.cpus();
  const totalMemGb = Math.round((os.totalmem() / 1073741824) * 100) / 100;

  let diskTotalGb: number | undefined;
  try {
    if (process.platform === 'win32') {
      const output = execSync('wmic logicaldisk get size /value', { encoding: 'utf8', timeout: 5000 });
      const match = output.match(/Size=(\d+)/);
      if (match) diskTotalGb = Math.round(parseInt(match[1]) / 1073741824 * 100) / 100;
    } else {
      const output = execSync("df -k / | tail -1 | awk '{print $2}'", { encoding: 'utf8', timeout: 5000 });
      diskTotalGb = Math.round(parseInt(output.trim()) / 1048576 * 100) / 100;
    }
  } catch { /* ignore */ }

  return {
    hostname: os.hostname(),
    os: process.platform,
    os_version: `${os.type()} ${os.release()}`,
    arch: os.arch(),
    cpu_model: cpus[0]?.model || 'unknown',
    cpu_cores: cpus.length,
    total_memory_gb: totalMemGb,
    total_disk_gb: diskTotalGb,
  };
}

export function collectMetrics(sourceName: string): SystemMetricsEntry {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const loadAvg = os.loadavg();

  const metrics: SystemMetricsEntry = {
    source_name: sourceName,
    cpu_count: cpus.length,
    cpu_load_1m: Math.round(loadAvg[0] * 100) / 100,
    cpu_load_5m: Math.round(loadAvg[1] * 100) / 100,
    cpu_load_15m: Math.round(loadAvg[2] * 100) / 100,
    memory_total_mb: Math.round(totalMem / 1048576),
    memory_used_mb: Math.round(usedMem / 1048576),
    memory_percent: Math.round((usedMem / totalMem) * 10000) / 100,
    uptime_seconds: Math.round(os.uptime()),
    timestamp: new Date().toISOString(),
  };

  // CPU usage percentage (delta between this call and the previous one)
  try {
    const cpuPct = getCpuPercent(cpus);
    if (cpuPct !== undefined) metrics.cpu_percent = cpuPct;
  } catch { /* ignore */ }

  // Disk usage
  try {
    const disk = getDiskUsage();
    if (disk) {
      metrics.disk_total_gb = disk.totalGb;
      metrics.disk_used_gb = disk.usedGb;
      metrics.disk_percent = disk.percent;
    }
  } catch { /* ignore */ }

  // Swap
  try {
    const swap = getSwapUsage();
    if (swap) {
      metrics.swap_total_mb = swap.totalMb;
      metrics.swap_used_mb = swap.usedMb;
      metrics.swap_percent = swap.percent;
    }
  } catch { /* ignore */ }

  // Network connections count
  try {
    metrics.network_connections = getNetworkConnections();
  } catch { /* ignore */ }

  // Process count
  try {
    const procs = getProcessCount();
    metrics.process_count = procs.total;
    metrics.zombie_count = procs.zombie;
  } catch { /* ignore */ }

  // Top processes
  try {
    metrics.top_processes = getTopProcesses();
  } catch { /* ignore */ }

  // CPU temperature (Linux/macOS)
  try {
    metrics.cpu_temp_celsius = getCpuTemperature();
  } catch { /* ignore */ }

  // GPU info (nvidia-smi if available)
  try {
    const gpu = getGpuInfo();
    if (gpu) {
      metrics.gpu_percent = gpu.utilization;
      metrics.gpu_memory_percent = gpu.memoryPercent;
      metrics.gpu_temp_celsius = gpu.temperature;
    }
  } catch { /* ignore */ }

  return metrics;
}

// Store the previous CPU snapshot so we can compute a delta between two calls.
// On the very first call we return undefined (no baseline yet).
let prevCpuTimes: { idle: number; total: number } | null = null;

function getCpuPercent(cpus: os.CpuInfo[]): number | undefined {
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += (cpu.times as Record<string, number>)[type];
    }
    idle += cpu.times.idle;
  }

  if (prevCpuTimes === null) {
    // First sample — store baseline, no percentage yet
    prevCpuTimes = { idle, total };
    return undefined;
  }

  const idleDelta = idle - prevCpuTimes.idle;
  const totalDelta = total - prevCpuTimes.total;
  prevCpuTimes = { idle, total };

  if (totalDelta === 0) return 0;
  return Math.round((1 - idleDelta / totalDelta) * 10000) / 100;
}

function getDiskUsage(): { totalGb: number; usedGb: number; percent: number } | null {
  try {
    if (process.platform === 'win32') {
      const output = execSync('wmic logicaldisk get size,freespace /value', { encoding: 'utf8', timeout: 5000 });
      const freeMatch = output.match(/FreeSpace=(\d+)/);
      const sizeMatch = output.match(/Size=(\d+)/);
      if (freeMatch && sizeMatch) {
        const total = parseInt(sizeMatch[1]);
        const free = parseInt(freeMatch[1]);
        const used = total - free;
        return {
          totalGb: Math.round(total / 1073741824 * 100) / 100,
          usedGb: Math.round(used / 1073741824 * 100) / 100,
          percent: Math.round((used / total) * 10000) / 100,
        };
      }
    } else {
      const output = execSync("df -k / | tail -1", { encoding: 'utf8', timeout: 5000 });
      const parts = output.trim().split(/\s+/);
      const total = parseInt(parts[1]) * 1024;
      const used = parseInt(parts[2]) * 1024;
      return {
        totalGb: Math.round(total / 1073741824 * 100) / 100,
        usedGb: Math.round(used / 1073741824 * 100) / 100,
        percent: Math.round((used / total) * 10000) / 100,
      };
    }
  } catch { /* ignore */ }
  return null;
}

function getSwapUsage(): { totalMb: number; usedMb: number; percent: number } | null {
  try {
    if (process.platform === 'linux') {
      const meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
      const swapTotal = parseInt(meminfo.match(/SwapTotal:\s+(\d+)/)?.[1] || '0') * 1024;
      const swapFree = parseInt(meminfo.match(/SwapFree:\s+(\d+)/)?.[1] || '0') * 1024;
      if (swapTotal > 0) {
        const used = swapTotal - swapFree;
        return {
          totalMb: Math.round(swapTotal / 1048576),
          usedMb: Math.round(used / 1048576),
          percent: Math.round((used / swapTotal) * 10000) / 100,
        };
      }
    } else if (process.platform === 'darwin') {
      const output = execSync('sysctl vm.swapusage', { encoding: 'utf8', timeout: 5000 });
      const totalMatch = output.match(/total = ([\d.]+)M/);
      const usedMatch = output.match(/used = ([\d.]+)M/);
      if (totalMatch && usedMatch) {
        const total = parseFloat(totalMatch[1]);
        const used = parseFloat(usedMatch[1]);
        return {
          totalMb: Math.round(total),
          usedMb: Math.round(used),
          percent: total > 0 ? Math.round((used / total) * 10000) / 100 : 0,
        };
      }
    }
  } catch { /* ignore */ }
  return null;
}

function getNetworkConnections(): number {
  try {
    if (process.platform === 'win32') {
      const output = execSync('netstat -an | find /c "ESTABLISHED"', { encoding: 'utf8', timeout: 5000 });
      return parseInt(output.trim()) || 0;
    } else {
      const output = execSync("netstat -an 2>/dev/null | grep ESTABLISHED | wc -l", { encoding: 'utf8', timeout: 5000 });
      return parseInt(output.trim()) || 0;
    }
  } catch { return 0; }
}

function getProcessCount(): { total: number; zombie: number } {
  try {
    if (process.platform === 'win32') {
      const output = execSync('tasklist /NH', { encoding: 'utf8', timeout: 5000 });
      return { total: output.trim().split('\n').length, zombie: 0 };
    } else {
      const total = parseInt(execSync("ps aux | wc -l", { encoding: 'utf8', timeout: 5000 }).trim()) - 1;
      let zombie = 0;
      if (process.platform === 'linux') {
        zombie = parseInt(execSync("ps aux | awk '$8 ~ /Z/ {count++} END {print count+0}'", { encoding: 'utf8', timeout: 5000 }).trim());
      }
      return { total, zombie };
    }
  } catch { return { total: 0, zombie: 0 }; }
}

function getTopProcesses(count = 5): ProcessInfo[] {
  try {
    if (process.platform === 'win32') {
      const output = execSync(
        'powershell -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Name,Id,CPU,WorkingSet64 | ConvertTo-Csv -NoTypeInformation"',
        { encoding: 'utf8', timeout: 10000 }
      );
      return output.trim().split('\n').slice(1).map(line => {
        const parts = line.replace(/"/g, '').split(',');
        return {
          name: parts[0] || 'unknown',
          pid: parseInt(parts[1]) || 0,
          cpu: parseFloat(parts[2]) || 0,
          memory: Math.round((parseInt(parts[3]) || 0) / 1048576),
        };
      }).filter(p => p.name !== 'unknown');
    } else {
      const output = execSync(
        `ps aux --sort=-%cpu 2>/dev/null | head -${count + 1} || ps aux -r | head -${count + 1}`,
        { encoding: 'utf8', timeout: 5000 }
      );
      return output.trim().split('\n').slice(1).map(line => {
        const parts = line.trim().split(/\s+/);
        return {
          name: parts[10] || parts[parts.length - 1] || 'unknown',
          pid: parseInt(parts[1]) || 0,
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
        };
      });
    }
  } catch { return []; }
}

function getCpuTemperature(): number | undefined {
  try {
    if (process.platform === 'linux') {
      // Try thermal zone
      const zones = ['/sys/class/thermal/thermal_zone0/temp', '/sys/class/thermal/thermal_zone1/temp'];
      for (const zone of zones) {
        if (fs.existsSync(zone)) {
          const temp = parseInt(fs.readFileSync(zone, 'utf8').trim());
          return Math.round(temp / 100) / 10;
        }
      }
    } else if (process.platform === 'darwin') {
      // macOS doesn't have a simple way without third-party tools
      // Try osx-cpu-temp if installed
      const output = execSync('which osx-cpu-temp >/dev/null 2>&1 && osx-cpu-temp 2>/dev/null || true', { encoding: 'utf8', timeout: 3000 });
      const match = output.match(/([\d.]+)°C/);
      if (match) return parseFloat(match[1]);
    }
  } catch { /* ignore */ }
  return undefined;
}

function getGpuInfo(): { utilization: number; memoryPercent: number; temperature: number } | null {
  try {
    const output = execSync(
      'nvidia-smi --query-gpu=utilization.gpu,utilization.memory,temperature.gpu --format=csv,noheader,nounits 2>/dev/null',
      { encoding: 'utf8', timeout: 5000 }
    );
    const parts = output.trim().split(',').map(s => parseFloat(s.trim()));
    if (parts.length >= 3) {
      return {
        utilization: parts[0],
        memoryPercent: parts[1],
        temperature: parts[2],
      };
    }
  } catch { /* nvidia-smi not available */ }
  return null;
}
