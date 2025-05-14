export const getCookie = (name) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
    console.log(cookieValue);
  return cookieValue ? cookieValue.split("=")[1] : null;
};
