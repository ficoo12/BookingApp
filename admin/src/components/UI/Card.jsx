function Card(props) {
  return (
    <div className="bg-white p-4 text-blue-950 rounded-lg max-w-md space-y-3">
      {props.children}
    </div>
  );
}

export default Card;
