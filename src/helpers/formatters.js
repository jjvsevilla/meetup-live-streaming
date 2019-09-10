const NUMBER_TYPE = "number";

export function numberFormatter(params) {
  if (typeof params.value === NUMBER_TYPE) {
    return params.value.toFixed(2);
  } else {
    return params.value;
  }
}
