async function fetchData(user) {
  const url = `http://localhost:3307/photos?userId=${user.id}`;
  const jsonData = await (await fetch(url)).json();
  console.log(jsonData, "jsondata");
  return jsonData;
}
export default fetchData;
