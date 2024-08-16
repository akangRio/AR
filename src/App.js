import logo from "./logo.svg";
import "./App.css";

import React, { useEffect, useRef } from "react";
import { BANUBA_CLIENT_TOKEN } from "./BanubaClientToken";
import { Webcam, Player, Module, Effect, Dom } from "@banuba/webar";

import wasm from "@banuba/webar/BanubaSDK.wasm";
import simd from "@banuba/webar/BanubaSDK.simd.wasm";
import data from "@banuba/webar/BanubaSDK.data";

// Find more about available modules:
// https://docs.banuba.com/face-ar-sdk-v1/generated/typedoc/classes/Module.html
import FaceTracker from "@banuba/webar/face_tracker.zip";
import Lips from "@banuba/webar/lips.zip";
import Makeup from "@banuba/webar/makeup.zip";
import FaceAttributes from "@banuba/webar/face_attributes.zip";
import FaceTrackerLite from "@banuba/webar/skin.zip";

function App() {
  const ref = useRef({});
  const lipsModule = new Module(Lips);
  const faceTrackerModule = new Module(FaceTracker);
  const makeUpModule = new Module(Makeup);
  const faceAttributeModule = new Module(FaceAttributes);
  const faceTrackerLiteModule = new Module(FaceTrackerLite);

  const glasses = new Effect("effects/glasses_Banuba.zip");
  const lipGlitter = new Effect("effects/test_Lips_glitter.zip");
  const simpleHat = new Effect("effects/simple_hat_v2.zip");
  const lipstick = new Effect("effects/lipstick.zip");
  const lipstickijo = new Effect("effects/lipstickijo.zip");

  console.log(lipsModule);
  console.log(makeUpModule);

  // componentDidMount
  useEffect(() => {
    const webcam = (ref.current.webcam ??= new Webcam());
    const promise = (ref.current.player ??= Player.create({
      clientToken: BANUBA_CLIENT_TOKEN,
      /**
       * By default BanubaSDK.js tries to loads BanubaSDK.wasm and BanubaSDK.data files relative to itself.
       * Since the BanubaSDK.js will be bundled to something like `static/js/[name].[hash].js` during a build
       * and the BanubaSDK.wasm and BanubaSDK.data files may not lay next to the bundle file
       * we have to tell the BanubaSDK where it can find these BanubaSDK.wasm and BanubaSDK.data files.
       * @see {@link https://docs.banuba.com/generated/typedoc/globals.html#sdkoptions} further information}
       */
      locateFile: {
        "BanubaSDK.wasm": wasm,
        "BanubaSDK.simd.wasm": simd,
        "BanubaSDK.data": data,
      },
    }).then((player) =>
      player.addModule(lipsModule).then(() => {
        player.addModule(faceTrackerModule).then(() => {
          player.addModule(makeUpModule).then(() => {
            player.addModule(faceAttributeModule).then(() => {
              player.addModule(faceTrackerLiteModule).then(() => {
                player.use(webcam);
                // player.applyEffect(lipstick);
                // player.applyEffect(lipGlitter);

                Dom.render(player, "#webar");
              });
            });
          });
        });
      }),
    ));

    return () => {
      webcam.stop();
      Dom.unmount("#webar");
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div id="webar" style={{ maxWidth: "600px" }}></div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
