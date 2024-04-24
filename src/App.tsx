import styles from "./App.module.css"
import Alert from "./components/Form/Alert/Alert";
import Form from "./components/Form/Form"
import Spinner from "./components/Spinner/Spinner";
import WeatherDetail from "./components/WeatherDetail/WeatherDetail";
import useWeather from "./hooks/useWeather"
function App() {

  const { weather, loading, notFound, alert, setAlert, fetchWeather, hasWeatherData} = useWeather();
  return (
    <>
      <h1 className={styles.title}>Buscador de clima</h1>

      <div className={styles.container}>
        <Form
        alert={alert}
        setAlert={setAlert}
        fetchWeather={fetchWeather}
        />
        { loading && <Spinner />}
        { hasWeatherData &&
          <WeatherDetail
            weather={weather}
          />
        }
        { !loading && notFound && <Alert>Ciudad No Encontrada</Alert>}
      </div>

    </>
  )
}

export default App
