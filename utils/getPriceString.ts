const isInt = (n: number): boolean => {
  return n % 1 === 0;
};

const getFloatPrecision = (number: number): number => {
  const string = number.toString();
  const [, float] = string.split('.');

  if (!float || float.length <= 0) {
    return 0;
  }

  return float.length;
};

const calcCurrency = (amount: number, precision?: number): number => {
  return parseFloat((amount / 10 ** precision).toString());
};

type Props = {
  amount: number;
  precision: number;
  minVisiblePrecision?: number;
  maxVisiblePrecision?: number;
  exchangeRate?: number;
};

export const getPriceString = ({ amount, precision = 18, minVisiblePrecision, maxVisiblePrecision }: Props): any => {
  if (!amount) return null;

  const value = precision ? calcCurrency(amount, precision) : amount;

  let valueString = value.toString();

  const floatPrecision = getFloatPrecision(value);

  if (maxVisiblePrecision && !isInt(value) && floatPrecision > maxVisiblePrecision) {
    valueString = value.toFixed(maxVisiblePrecision);
  }

  if (minVisiblePrecision && floatPrecision < minVisiblePrecision) {
    valueString = value.toFixed(minVisiblePrecision);
  }

  if (value > 100000 && isInt(value)) {
    valueString = value.toFixed(0);
  }

  return valueString;
};
