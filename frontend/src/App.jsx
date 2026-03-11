import {useQuery} from "@apollo/client/react";
import { GET_SEAPORTS } from "./queries";
function App() {
  const {data, loading,error} = useQuery(GET_SEAPORTS);
  if(loading) return <p>loading</p>;
  if(error) return <p>Error: {error}</p>
  const seaports=data?.seaports || [];

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>PortName</th>
            <th>Lococde</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Conutry Code</th>
          </tr>
        </thead>
        <tbody>
          {seaports.map((port)=>(
            <tr key={port.locode}>
              <td>
                {port.portName}
              </td>
              <td>
                {port.locode}
              </td>
              <td>
                {port.latitude}
              </td>
              <td>
                {port.longitude}
              </td>
              <td>
                {port.countryIso}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
       
    </>
  )
}

export default App
