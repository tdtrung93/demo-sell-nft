import Svg from '@components/Core/Svg';
import { colors } from '@data/config';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const DropDownContainer = styled.div`
  font-family: sans-serif;
  position: relative;
  margin: 1rem 0;
`;
const DropDownHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 15px 1rem;
  background: #1f1f1f;
  border-radius: 4px;
  z-index: 6;
  grid-column-gap: 10px;
`;
const DropDownListContainer = styled.div`
  margin-bottom: 0.8em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.3rem;
  color: ${colors.white};
  background: #1f1f1f;
  z-index: 6;
  margin-top: 5px;
  border-radius: 4px;
  border: thin solid ${colors.grayDark3};

  position: absolute;
  width: 100%;
  overflow-y: auto;
  max-height: 200px;
  top: 100%;
`;
const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  background: #1f1f1f;
  box-sizing: border-box;
  color: ${colors.white};
  font-size: 1.3rem;
  font-weight: 500;
`;

const ListItem = styled.li<{ isActive: boolean }>`
  list-style: none;
  padding: 15px;
  display: grid;
  align-items: center;

  background-color: ${({ isActive }) => (isActive ? 'rgba(219, 219, 219, 0.3)' : 'initial')};

  &:hover {
    cursor: pointer;
    background-color: rgba(219, 219, 219, 0.3);
  }
`;

const Label = styled.span`
  font-size: 16px;
  line-height: 16px;
  font-family: 'Roboto Condensed';
  font-weight: 500;
  text-transform: uppercase;
  `;
  
  const LabelDuration = styled.div`
  font-family: 'Roboto Condensed';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  color: #939393;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export interface SelectOption {
  label: string;
  value: any;
}

type Allowed = string | number;

type BaseProps<Value> = {
  value: Value;
  onChange: (newValue: Value) => void;
  options: readonly Value[];
  icon?: string;
  mapOptionToLabel?: (option: Value) => Allowed;
  mapOptionToValue?: (option: Value) => Allowed;
};

// mappers required only in certain cirumstances
// we could get fancier here and also not require if `Value` has `value`/`label` properties
type Props<Value> = Value extends Allowed ? BaseProps<Value> : Required<BaseProps<Value>>;

const isAllowed = (v: any): v is Allowed => typeof v === 'string' || typeof v === 'number';

export function Select<Value>({ value, onChange, options, mapOptionToLabel, mapOptionToValue, icon }: Props<Value>) {
  const selectRef = useRef<any>();
  const [open, setOpen] = useState(false);

  const toLabel = useCallback((option: Value): Allowed => {
    if (mapOptionToLabel) {
      return mapOptionToLabel(option);
    }
    return isAllowed(option) ? option : String(option);
  }, []);

  const toValue = useCallback((option: Value): Allowed => {
    if (mapOptionToValue) {
      return mapOptionToValue(option);
    }
    return isAllowed(option) ? option : String(option);
  }, []);

  const handleChange = useCallback(
    (option) => {
      onChange(option);
    },
    [onChange]
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    if (selectRef.current) {
      if (!selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
  };

  const handleKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const toggleOptionList = () => setOpen(!open);

  const renderOption = useCallback(
    (option: any) => {
      return (
        <ListItem isActive={toValue(value) === option.value} onClick={() => handleChange(option)} key={toValue(option)}>
          <Label>{toLabel(option)}</Label>
        </ListItem>
      );
    },
    [handleChange, toLabel, toValue, value]
  );

  return (
    <DropDownContainer>
      <LabelDuration>Duration</LabelDuration>

      <DropDownHeader ref={selectRef} onClick={toggleOptionList}>
        <>
          {!!icon && <Svg name={icon} width={24} height={24} fill="white" />}
          <Label>{toLabel(value)}</Label>
          <Svg name="arrow-down" fill="white" width={10} height={10} />
        </>
      </DropDownHeader>
      {open && (
        <DropDownListContainer>
          <DropDownList>{options.map((option) => renderOption(option))}</DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
}
