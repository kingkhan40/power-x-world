import { IconType } from "react-icons";

interface AdminCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function AdminCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
}: AdminCardProps) {
  return (
    <div
      className={`
      bg-white/5 rounded-xl shadow-sm border border-gray-500 backdrop-blur-md p-6
      hover:shadow-md transition-shadow duration-200
      ${className}
    `}
    >
      <div className="flex  justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-100 mb-2">{value}</p>

          {subtitle && <p className="text-sm text-gray-300 mb-2">{subtitle}</p>}

          {trend && (
            <div
              className={`inline-flex items-center text-sm font-medium ${
                trend.isPositive ? "text-green-300" : "text-red-300"
              }`}
            >
              <span>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-50/20 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-100" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCard;
