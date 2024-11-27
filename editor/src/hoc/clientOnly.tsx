import { useEffect, useState } from 'react';

export function clientOnly<Props extends object>(
  Component: React.FC<Props>,
  fallback: React.ReactNode = null
) {
  const ClientOnlyComponent = (props: Props) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    return isClient ? <Component {...props} /> : fallback;
  };

  ClientOnlyComponent.displayName = Component.displayName;

  return ClientOnlyComponent;
}
