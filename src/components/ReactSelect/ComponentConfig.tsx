import { IndicatorSeparatorProps, components, DropdownIndicatorProps } from 'react-select';
import ArrowDown from './ArrowDown';

const indicatorSeparatorStyle = {
    display: "none"
};
  
export const IndicatorSeparator = ({
    innerProps,
  }: IndicatorSeparatorProps<any, true>) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
};

export const DropdownIndicator = (
    props: DropdownIndicatorProps<any, true>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
         <ArrowDown/>
      </components.DropdownIndicator>
    );
  };
