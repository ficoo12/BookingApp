function Card(props) {
  return (
    <div className="bg-white p-4 text-blue-950 rounded-lg max-w-md space-y-3 dark:bg-gray-800 dark:text-gray-100">
      {props.children}
    </div>
  );
}

export default Card;
