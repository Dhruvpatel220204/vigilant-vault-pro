import { motion } from 'framer-motion';
import { Globe, LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionData {
  id: string;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: string | null;
  is_active: boolean;
  last_active: string;
  created_at: string;
}

interface ActiveSessionsCardProps {
  sessions: SessionData[];
  currentSessionId?: string;
  onEndSession: (id: string) => void;
}

export default function ActiveSessionsCard({ sessions, onEndSession }: ActiveSessionsCardProps) {
  const activeSessions = sessions.filter(s => s.is_active);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Sessions</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-mono">{activeSessions.length} active</span>
        </div>
      </div>

      <div className="space-y-3">
        {activeSessions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No active sessions</p>
        ) : (
          activeSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {session.browser || 'Unknown'} · {session.os || 'Unknown'}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{session.ip_address || 'N/A'}</span>
                  {session.location && <span>· {session.location}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(session.last_active).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onEndSession(session.id)}
              >
                <LogOut className="w-4 h-4 mr-1" />
                End
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
