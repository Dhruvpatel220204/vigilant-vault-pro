import { motion } from 'framer-motion';
import { Smartphone, Monitor, Tablet, Shield, ShieldOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Device {
  id: string;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  trust_score: number;
  is_trusted: boolean;
  last_seen: string;
}

interface DevicesCardProps {
  devices: Device[];
  onRemoveDevice: (id: string) => void;
  onToggleTrust: (id: string, trusted: boolean) => void;
}

function getDeviceIcon(os: string | null) {
  if (!os) return Monitor;
  const lower = os.toLowerCase();
  if (lower.includes('android') || lower.includes('ios')) return Smartphone;
  if (lower.includes('ipad')) return Tablet;
  return Monitor;
}

export default function DevicesCard({ devices, onRemoveDevice, onToggleTrust }: DevicesCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Registered Devices</h3>
        <span className="text-xs text-muted-foreground font-mono">{devices.length} devices</span>
      </div>

      <div className="space-y-3">
        {devices.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No devices registered yet</p>
        ) : (
          devices.map((device, index) => {
            const Icon = getDeviceIcon(device.os);
            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {device.browser || 'Unknown Browser'} on {device.os || 'Unknown OS'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IP: {device.ip_address || 'N/A'} · Trust: {device.trust_score}/100
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleTrust(device.id, !device.is_trusted)}
                    title={device.is_trusted ? 'Revoke trust' : 'Mark as trusted'}
                  >
                    {device.is_trusted ? (
                      <Shield className="w-4 h-4 text-success" />
                    ) : (
                      <ShieldOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => onRemoveDevice(device.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
