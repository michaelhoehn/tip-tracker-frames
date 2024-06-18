import { farcasterHubContext } from "frames.js/middleware";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/api/frame",
  middleware: [
    farcasterHubContext({
      // remove if you aren't using @frames.js/debugger or you just don't want to use the debugger hub
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
  ],
});

export const handleRequest = frames(async (ctx) => {
  const fid = ctx.message?.requesterFid;
  const displayName = ctx.message?.requesterUserData?.displayName;

  if (!fid) {
    console.error("FID not found");
    return {
      image: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          Unable to retrieve FID. Please try again.
        </div>
      ),
      buttons: [],
    };
  }

  console.log(`FID: ${fid}`);

  if (!ctx.url.searchParams.has("checkTips")) {
    return {
      image: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          Hello, {displayName}! Your FID is {fid}.
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { checkTips: true } }}>
          Check Daily Tips
        </Button>,
      ],
      data: { fid },
    };
  }

  try {
    // Fetch username and tip amount based on fid
    console.log(`Fetching username for FID: ${fid}`);
    const neynarUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
    console.log(`Neynar URL: ${neynarUrl}`);
    console.log(`Neynar API Key: ${process.env.NEYNAR_API_KEY}`);

    const neynarResponse = await fetch(neynarUrl, {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    });

    console.log(`Neynar response status: ${neynarResponse.status}`);
    const neynarText = await neynarResponse.text();
    console.log(`Neynar raw response: ${neynarText}`);

    if (!neynarResponse.ok) {
      throw new Error(
        `Neynar API request failed with status: ${neynarResponse.status}`
      );
    }

    const neynarData = JSON.parse(neynarText);
    const username = neynarData.users[0]?.username;

    if (!username) {
      return {
        image: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            Username not found for FID {fid}.
          </div>
        ),
        buttons: [],
      };
    }

    console.log(`Fetching tip amount for username: @${username}`);
    const duneUrl = `https://api.dune.com/api/v1/query/3835652/results?limit=1&filters=username='@${username}'`;
    console.log(`Dune URL: ${duneUrl}`);
    console.log(`Dune API Key: ${process.env.DUNE_API_KEY}`);

    const duneResponse = await fetch(duneUrl, {
      headers: {
        "X-Dune-API-Key": process.env.DUNE_API_KEY as string,
      },
    });

    console.log(`Dune response status: ${duneResponse.status}`);
    const duneText = await duneResponse.text();
    console.log(`Dune raw response: ${duneText}`);

    if (!duneResponse.ok) {
      throw new Error(
        `Dune API request failed with status: ${duneResponse.status}`
      );
    }

    const duneData = JSON.parse(duneText);
    const tipAmount = duneData.result?.rows[0]["Total Tip Amount"];

    if (tipAmount == null) {
      return {
        image: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            Tip amount not found for username @{username}.
          </div>
        ),
        buttons: [],
      };
    }

    return {
      image: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          Username: @{username}
          <br />
          Daily Tip Amount: {tipAmount}
        </div>
      ),
      buttons: [],
      data: { fid, username, tipAmount },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      return {
        image: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            An error occurred: ${error.message}
          </div>
        ),
        buttons: [],
      };
    }
    console.error("Unknown error occurred");
    return {
      image: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          An unknown error occurred.
        </div>
      ),
      buttons: [],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
