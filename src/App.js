import "./App.css";
import ProgressBar from "./progressBar";

function App() {
  return (
    <div className="App">
      <ProgressBar
        primarycolor="black"
        accesscolor="white"
        segments={4}
        edit={true}
        fill={1}
        progressEmpty={false}
      />
    </div>
  );
}

export default App;
