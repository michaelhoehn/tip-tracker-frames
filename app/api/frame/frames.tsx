import { farcasterHubContext } from "frames.js/middleware";
import { createFrames, Button } from "frames.js/next";
import { appURL } from "../../../utils";
import ChartComponent from "../../../ChartComponent";
import React from "react";

export type State = {
  fid?: number;
  username?: string;
  tipAmount?: number;
  date?: string;
  weeklyTips?: number[];
  weeklyDates?: string[];
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
  console.log("Requester FID:", fid);

  const imageUrl = new URL("/image-new.png", appURL()).toString();

  const urlParams = ctx.url.searchParams;
  console.log("URL Parameters:", urlParams.toString());

  const sharedFid = urlParams.get("fid");
  const sharedTipAmount = urlParams.get("tipAmount");
  const sharedUsername = urlParams.get("username");
  const sharedDate = urlParams.get("date");
  const sharedWeeklyTips = urlParams.get("weeklyTips")?.split(",").map(Number);
  const sharedWeeklyDates = urlParams.get("weeklyDates")?.split(",");

  console.log(
    "Shared Params - FID:",
    sharedFid,
    "Tip Amount:",
    sharedTipAmount,
    "Username:",
    sharedUsername,
    "Date:",
    sharedDate,
    "Weekly Tips:",
    sharedWeeklyTips,
    "Weekly Dates:",
    sharedWeeklyDates
  );

  if (sharedFid && sharedWeeklyTips && sharedWeeklyDates && sharedUsername) {
    const shareText = encodeURIComponent(`Weekly Tip Jar by @cmplx.eth`);
    const embedUrl = encodeURIComponent(
      `${appURL()}/api/frame?fid=${sharedFid}&weeklyTips=${sharedWeeklyTips}&weeklyDates=${sharedWeeklyDates}&username=${sharedUsername}`
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
            paddingTop: "20px", // Added padding to the top
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "3rem",
              marginBottom: "10px",
            }}
          >
            {sharedUsername}'s Weekly Tips
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {sharedWeeklyTips && sharedWeeklyTips.length > 0 ? (
              <ChartComponent
                data={sharedWeeklyTips}
                dates={sharedWeeklyDates}
              />
            ) : (
              "No data available"
            )}
          </div>
        </div>
      ),
      buttons: [
        <Button
          key="tip-cmplx"
          action="link"
          target="https://warpcast.com/cmplx.eth/0x56ab5eff"
        >
          Tip cmplx
        </Button>,
        <Button
          key="count-tips"
          action="post"
          target={{ query: { checkTips: true } }}
        >
          Count My Tips
        </Button>,
        <Button key="share" action="link" target={shareUrl}>
          Share
        </Button>,
      ],
      state: {
        fid: parseInt(sharedFid, 10),
        username: sharedUsername,
        weeklyTips: sharedWeeklyTips,
        weeklyDates: sharedWeeklyDates,
      },
    };
  }

  if (sharedFid && sharedTipAmount && sharedUsername && sharedDate) {
    const shareText = encodeURIComponent(`Daily Tip Jar by @cmplx.eth`);
    const embedUrl = encodeURIComponent(
      `${appURL()}/api/frame?fid=${sharedFid}&tipAmount=${sharedTipAmount}&username=${
        sharedUsername || sharedFid
      }&date=${sharedDate}`
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
            paddingTop: "20px", // Added padding to the top
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
          key="tip-cmplx"
          action="link"
          target="https://warpcast.com/cmplx.eth/0x56ab5eff"
        >
          Tip cmplx
        </Button>,
        <Button
          key="count-tips"
          action="post"
          target={{ query: { checkTips: true } }}
        >
          Count My Tips
        </Button>,
        <Button
          key="show-weekly"
          action="post"
          target={{ query: { showWeekly: true } }}
        >
          Show Weekly
        </Button>,
        <Button key="share" action="link" target={shareUrl}>
          Share
        </Button>,
      ],
      state: {
        fid: parseInt(sharedFid, 10),
        username: sharedUsername,
        tipAmount: parseFloat(sharedTipAmount),
        date: sharedDate,
      },
    };
  }

  if (urlParams.has("showWeekly")) {
    try {
      const duneUrl = `https://api.dune.com/api/v1/query/3915099/results?limit=7&filters=fid=${fid}`;
      console.log("Dune API URL:", duneUrl);
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
      const weeklyData = duneData.result?.rows.map((row: any) => ({
        tips: row["Total Valid Tips"],
        date: `${new Date(row["Date"]).getMonth() + 1}/${new Date(
          row["Date"]
        ).getDate()}`,
      }));
      // Ensure the data is ordered from the earliest to the most recent
      weeklyData.reverse();
      const weeklyTips = weeklyData.map((data: any) => data.tips);
      const weeklyDates = weeklyData.map((data: any) => data.date);
      console.log("Fetched weekly tips:", weeklyTips);
      console.log("Fetched weekly dates:", weeklyDates);

      // Fetching the username for reliable source of truth
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
      console.log(`Fetched username: ${username}`);

      const shareText = encodeURIComponent(`Weekly Tip Jar by @cmplx.eth`);
      const embedUrl = encodeURIComponent(
        `${appURL()}/api/frame?fid=${fid}&weeklyTips=${weeklyTips}&weeklyDates=${weeklyDates}&username=${username}`
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
              paddingTop: "20px", // Added padding to the top
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "3rem",
                marginBottom: "10px",
              }}
            >
              {username}'s Weekly Tips
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {weeklyTips && weeklyTips.length > 0 ? (
                <ChartComponent data={weeklyTips} dates={weeklyDates} />
              ) : (
                "No data available"
              )}
            </div>
          </div>
        ),
        buttons: [
          <Button
            key="tip-cmplx"
            action="link"
            target="https://warpcast.com/cmplx.eth/0x56ab5eff"
          >
            Tip cmplx
          </Button>,
          <Button
            key="count-tips"
            action="post"
            target={{ query: { checkTips: true } }}
          >
            Count My Tips
          </Button>,
          <Button key="share" action="link" target={shareUrl}>
            Share
          </Button>,
        ],
        state: { fid, username, weeklyTips, weeklyDates },
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
  }

  if (!urlParams.has("checkTips")) {
    return {
      image: <img src={imageUrl} alt="Static Image" />,
      buttons: [
        <Button
          key="check-tips"
          action="post"
          target={{ query: { checkTips: true } }}
        >
          Count My Tips
        </Button>,
        <Button
          key="show-weekly"
          action="post"
          target={{ query: { showWeekly: true } }}
        >
          Show Weekly
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
    console.log(`Fetched username: ${username}`);

    console.log(`Fetching tip amount for FID: ${fid}`);
    const duneUrl = `https://api.dune.com/api/v1/query/3915099/results?limit=1&filters=fid=${fid}`;
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
    const tipAmount = duneData.result?.rows[0]["Total Valid Tips"];
    const queryDate = new Date(
      duneData.result?.rows[0]["Date"]
    ).toLocaleDateString();
    const currentDate = new Date().toLocaleDateString();

    console.log(
      `Tip amount: ${tipAmount}, Query Date: ${queryDate}, Current Date: ${currentDate}`
    );

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
            paddingTop: "20px", // Added padding to the top
          }}
        >
          <div
            style={{ display: "flex", fontSize: "3rem", marginBottom: "20px" }}
          >
            @{username || fid} has received
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
            In valid tips on {currentDate}
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
          key="tip-cmplx"
          action="link"
          target="https://warpcast.com/cmplx.eth/0x56ab5eff"
        >
          Tip cmplx
        </Button>,
        <Button
          key="count-tips"
          action="post"
          target={{ query: { checkTips: true } }}
        >
          Count My Tips
        </Button>,
        <Button
          key="show-weekly"
          action="post"
          target={{ query: { showWeekly: true } }}
        >
          Show Weekly
        </Button>,
        <Button key="share" action="link" target={shareUrl}>
          Share
        </Button>,
      ],
      state: { fid, username, tipAmount: finalTipAmount, date: currentDate },
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
