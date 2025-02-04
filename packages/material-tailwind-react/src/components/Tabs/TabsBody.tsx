import React from "react";

// utils
import merge from "deepmerge";
import classnames from "classnames";
import { twMerge } from "tailwind-merge";
import objectsToString from "../../utils/objectsToString";

// context
import { useTheme } from "../../context/theme";
import { useTabs, setAnimation } from "./TabsContext";

// types
import type { animate, className, children } from "../../types/components/tabs";
import {
  propTypesAnimate,
  propTypesClassName,
  propTypesChildren,
} from "../../types/components/tabs";

export interface TabsBodyProps extends React.ComponentProps<"div"> {
  animate?: animate;
  className?: className;
  children: children;
}

export const TabsBody = React.forwardRef<HTMLDivElement, TabsBodyProps>(
  ({ animate, className, children, ...rest }, ref) => {
    // 1. init
    const { tabsBody } = useTheme();
    const {
      defaultProps,
      styles: { base },
    } = tabsBody;
    const { dispatch } = useTabs();

    // 2. set default props
    className = className ?? defaultProps.className;
    animate = animate ?? defaultProps.animate;

    // 3. set styles
    const tabsBodyClasses = twMerge(classnames(objectsToString(base)), className);

    // 4. set animation
    const mainAnimation = React.useMemo(
      () => ({
        unmount: {
          opacity: 0,
          position: "absolute",
          top: "0",
          left: "0",
          transition: { duration: 0.5, times: [0.4, 0, 0.2, 1] },
        },
        mount: {
          opacity: 1,
          position: "relative",
          transition: { duration: 0.5, times: [0.4, 0, 0.2, 1] },
        },
      }),
      [],
    );

    const appliedAnimation = React.useMemo(
      () => merge(mainAnimation, animate),
      [animate, mainAnimation],
    );

    React.useEffect(() => {
      setAnimation(dispatch, appliedAnimation);
    }, [appliedAnimation, dispatch]);

    // 5. return
    return (
      <div {...rest} ref={ref} className={tabsBodyClasses}>
        {children}
      </div>
    );
  },
);

TabsBody.propTypes = {
  animate: propTypesAnimate,
  className: propTypesClassName,
  children: propTypesChildren,
};

TabsBody.displayName = "MaterialTailwind.TabsBody";

export default TabsBody;
