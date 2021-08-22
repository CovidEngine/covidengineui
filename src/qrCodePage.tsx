import {useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";
import "./App.css";
import QRCode from "qrcode.react";
import { API_URL, ExposureLocation, loiToQrValue } from './App';

export default function AllQRCodes() {
  const [exposureLocations, setExposureLocations] = useState<
    ExposureLocation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function fetchExposureLocations() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/exposurelocations`);
      const data = await res.json();
      setExposureLocations(data.exposureLocations);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchExposureLocations();
  }, []);

  return (
    <div className="App">
      <section className="container-small2">
        <h1>Scan in to a location of interest</h1>

        <div className="hr" />
        <aside>
          <strong>
            Have you been to a Location of Interest, but forgot to scan in?{" "}
          </strong>
          <div>
            No problem! You can scan it properly, including the Global Location
            Number, on this page! This way, instead of adding a manual diary
            entry, you will actually get an exposure notification.
          </div>
          <br />
        </aside>

        <aside>
          <strong>Why some QR codes are not available?</strong>
          <div>
            Some <i>Locations of Interest</i> have not been published as{" "}
            <i>Exposure Event</i> locations, so we can't match Global Location
            Numbers to them.
          </div>
          <br />
        </aside>

        {error ? <aside>Error Loading page</aside> : null}
        {!error && loading ? <aside>Loading...</aside> : null}
        {!error && !loading ? (
          <>
            <Link to="/">
              <button style={{ margin: "1rem 0 0 0" }} className="secondary">
                Back to Start
              </button>
            </Link>
            <br />
            <br />
            <br />
            <div className="grid-2">
              <ExposureLocationsQrCodes exposureLocations={exposureLocations} />
            </div>
            <br />
            <br />
            <Link to="/">
              <button style={{ margin: "1rem 0 0 0" }} className="secondary">
                Back to Start
              </button>
            </Link>
          </>
        ) : null}
      </section>
    </div>
  );
}

function ExposureLocationsQrCodes({
  exposureLocations,
}: {
  exposureLocations: ExposureLocation[];
}) {
  return (
    <>
      {exposureLocations.map((el) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ marginRight: "1rem" }}>
              <h2>{el.event}</h2>
              <div>{el.location}</div>
              <div>
                {new Date(el.start).toLocaleDateString()}{" "}
                {new Date(el.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {new Date(el.end).toLocaleDateString()}{" "}
                {new Date(el.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {el.gln ? (
              <QRCode value={loiToQrValue(el)} />
            ) : (
              <div
                style={{
                  width: 128,
                  minWidth: 128,
                  height: 128,
                  border: "1px solid black",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                QR code not available
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}