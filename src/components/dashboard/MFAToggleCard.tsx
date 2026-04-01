import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, KeyRound, Mail, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface MFAToggleCardProps {
  enabled: boolean;
  backupCodes: string[];
  onToggle: (enabled: boolean) => void;
  onGenerateBackupCodes: () => void;
}

export default function MFAToggleCard({ enabled, backupCodes, onToggle, onGenerateBackupCodes }: MFAToggleCardProps) {
  const [showCodes, setShowCodes] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Code copied');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Multi-Factor Authentication
        </h3>
      </div>

      {/* MFA Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border mb-4">
        <div className="flex items-center gap-3">
          <Shield className={`w-5 h-5 ${enabled ? 'text-success' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-sm font-medium text-foreground">MFA Protection</p>
            <p className="text-xs text-muted-foreground">
              {enabled ? 'Your account is protected with MFA' : 'Enable for extra security'}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>

      {/* MFA Methods */}
      {enabled && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="text-xs text-muted-foreground font-semibold uppercase mb-2">Available Methods</div>

          <MFAMethod icon={Mail} label="Email OTP" description="One-time code via email" status="active" />
          <MFAMethod icon={Smartphone} label="Authenticator App" description="TOTP-based (Google Authenticator)" status="available" />
          <MFAMethod icon={KeyRound} label="Backup Codes" description="Emergency access codes" status={backupCodes.length > 0 ? 'active' : 'available'} />

          {/* Backup Codes */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Recovery Codes</span>
              <Button variant="outline" size="sm" onClick={onGenerateBackupCodes}>
                Generate New Codes
              </Button>
            </div>

            {backupCodes.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowCodes(!showCodes)} className="mb-2">
                  {showCodes ? 'Hide codes' : 'Show codes'}
                </Button>
                {showCodes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {backupCodes.map((code, i) => (
                      <button
                        key={i}
                        onClick={() => copyCode(code, i)}
                        className="flex items-center justify-between px-3 py-2 rounded-md bg-muted border border-border font-mono text-xs text-foreground hover:bg-secondary transition-colors"
                      >
                        <span>{code}</span>
                        {copiedIndex === i ? (
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MFAMethod({ icon: Icon, label, description, status }: {
  icon: React.ElementType;
  label: string;
  description: string;
  status: 'active' | 'available';
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
      <Icon className={`w-4 h-4 ${status === 'active' ? 'text-success' : 'text-muted-foreground'}`} />
      <div className="flex-1">
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
        status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
      }`}>
        {status}
      </span>
    </div>
  );
}
