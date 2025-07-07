import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, icon, className }: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
