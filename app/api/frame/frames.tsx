import { farcasterHubContext } from "frames.js/middleware";
import { createFrames, Button } from "frames.js/next";
import { appURL } from "../../../utils";

export type State = {
  username?: string;
  tipAmount?: number;
  date?: string;
};

const frames = createFrames<State>({
  basePath: "/api/frame",
  middleware: [
    farcasterHubContext({
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
  ],
  initialState: {},
});

export const handleRequest = frames(async (ctx) => {
  const fid = ctx.message?.requesterFid;
  const urlParams = ctx.url.searchParams;

  // Extracting URL parameters if available
  const sharedFid = urlParams.get("fid");
  const sharedTipAmount = urlParams.get("tipAmount");
  const sharedUsername = urlParams.get("username");
  const sharedDate = urlParams.get("date");

  // If the URL contains shared state, use it
  if (sharedFid && sharedTipAmount && sharedUsername && sharedDate) {
    return {
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0A1128",
            color: "#00FF00",
            fontFamily: "'Courier New', Courier, monospace",
            aspectRatio: "1.91/1",
          }}
        >
          <div
            style={{ display: "flex", fontSize: "3rem", marginBottom: "20px" }}
          >
            Your Daily Tips
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "6rem",
              border: "3px solid #8A2BE2",
              padding: "10px 20px",
              marginBottom: "20px",
              color: "#00FF00",
              whiteSpace: "nowrap",
            }}
          >
            {sharedTipAmount} $degen
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            Showing current tips received for...
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            @{sharedUsername || sharedFid}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            {sharedDate}
          </div>
          <div
            style={{ display: "flex", fontSize: "1.2rem", color: "#00FF00" }}
          >
            frame by @cmplx.eth
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="link"
          target="https://warpcast.com/cmplx.eth/0x56ab5eff"
        >
          Tip cmplx
        </Button>,
      ],
      state: {
        username: sharedUsername,
        tipAmount: parseFloat(sharedTipAmount),
        date: sharedDate,
      },
    };
  }

  // Original logic for generating the frame
  if (!urlParams.has("checkTips")) {
    return {
      image: (
        <img
          src={new URL("/image-new.png", appURL()).toString()}
          alt="Static Image"
        />
      ),
      buttons: [
        <Button action="post" target={{ query: { checkTips: true } }}>
          Count My Tips
        </Button>,
      ],
    };
  }

  try {
    console.log(`Fetching username for FID: ${fid}`);
    const neynarUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
    const neynarResponse = await fetch(neynarUrl, {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    });

    if (!neynarResponse.ok) {
      throw new Error(
        `Neynar API request failed with status: ${neynarResponse.status}`
      );
    }

    const neynarData = await neynarResponse.json();
    const username = neynarData.users[0]?.username;

    console.log(`Fetching tip amount for FID: ${fid}`);
    const duneUrl = `https://api.dune.com/api/v1/query/3835652/results?limit=1&filters=fid=${fid}`;
    const duneResponse = await fetch(duneUrl, {
      headers: {
        "X-Dune-API-Key": process.env.DUNE_API_KEY as string,
      },
    });

    if (!duneResponse.ok) {
      throw new Error(
        `Dune API request failed with status: ${duneResponse.status}`
      );
    }

    const duneData = await duneResponse.json();
    const tipAmount = duneData.result?.rows[0]["Total Tip Amount"];
    const queryDate = new Date(
      duneData.result?.rows[0]["Date"]
    ).toLocaleDateString();
    const currentDate = new Date().toLocaleDateString();

    const finalTipAmount = queryDate === currentDate ? tipAmount : 0;

    const shareText = encodeURIComponent(`Daily Tip Jar by @cmplx.eth`);
    const embedUrl = encodeURIComponent(
      `${appURL()}/api/frame?fid=${fid}&tipAmount=${finalTipAmount}&username=${
        username || fid
      }&date=${currentDate}`
    );
    const shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${embedUrl}`;

    return {
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0A1128",
            color: "#00FF00",
            fontFamily: "'Courier New', Courier, monospace",
            aspectRatio: "1.91/1",
          }}
        >
          <div
            style={{ display: "flex", fontSize: "3rem", marginBottom: "20px" }}
          >
            Your Daily Tips
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "6rem",
              border: "3px solid #8A2BE2",
              padding: "10px 20px",
              marginBottom: "20px",
              color: "#00FF00",
              whiteSpace: "nowrap",
            }}
          >
            {finalTipAmount} $degen
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            Showing current tips received for...
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            @{username || fid}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "2rem",
              color: "#00FF00",
              marginBottom: "20px",
            }}
          >
            {currentDate}
          </div>
          <div
            style={{ display: "flex", fontSize: "1.2rem", color: "#00FF00" }}
          >
            frame by @cmplx.eth
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="link"
          target="https://warpcast.com/cmplx.eth/0x56ab5eff"
        >
          Tip cmplx
        </Button>,
        <Button action="link" target={shareUrl}>
          Share
        </Button>,
      ],
      state: { username, tipAmount: finalTipAmount, date: currentDate },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      return {
        image: (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "#0A1128",
              color: "#00FF00",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            An error occurred: {error.message}
          </div>
        ),
        buttons: [],
      };
    }
    console.error("Unknown error occurred");
    return {
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0A1128",
            color: "#00FF00",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          An unknown error occurred.
        </div>
      ),
      buttons: [],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
