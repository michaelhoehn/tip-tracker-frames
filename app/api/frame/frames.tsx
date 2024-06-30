import { farcasterHubContext } from "frames.js/middleware";
import { createFrames, Button } from "frames.js/next";
import { appURL } from "../../../utils";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export type State = {
  fid?: number;
  username?: string;
  tipAmount?: number;
  date?: string;
  weeklyTips?: WeeklyTip[];
};

interface WeeklyTip {
  date: string;
  amount: number;
}

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

  const imageUrl = new URL("/image-new.png", appURL()).toString();

  const urlParams = ctx.url.searchParams;

  const sharedFid = urlParams.get("fid");
  const sharedTipAmount = urlParams.get("tipAmount");
  const sharedUsername = urlParams.get("username");
  const sharedDate = urlParams.get("date");

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

  if (!urlParams.has("checkTips") && !urlParams.has("viewWeekly")) {
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
          key="view-weekly"
          action="post"
          target={{ query: { viewWeekly: true } }}
        >
          View Weekly
        </Button>,
      ],
    };
  }

  try {
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

    let shareUrl = "";

    if (urlParams.has("checkTips")) {
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
      shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${embedUrl}`;

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
              style={{
                display: "flex",
                fontSize: "3rem",
                marginBottom: "20px",
              }}
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
        state: { fid, username, tipAmount: finalTipAmount, date: currentDate },
      };
    } else if (urlParams.has("viewWeekly")) {
      const duneUrl = `https://api.dune.com/api/v1/query/3835652/results?limit=7&filters=fid=${fid}`;
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
      const weeklyTips: WeeklyTip[] = duneData.result?.rows.map((row: any) => ({
        date: new Date(row["Date"]).toLocaleDateString(),
        amount: row["Total Tip Amount"],
      }));

      const shareText = encodeURIComponent(`Weekly Tip Jar by @cmplx.eth`);
      const embedUrl = encodeURIComponent(
        `${appURL()}/api/frame?fid=${fid}&username=${username || fid}`
      );
      shareUrl = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=${embedUrl}`;

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
            <div
              style={{
                display: "flex",
                fontSize: "3rem",
                marginBottom: "20px",
              }}
            >
              Your Weekly Tips
            </div>
            <Bar
              data={{
                labels: weeklyTips.map((tip: WeeklyTip) => tip.date),
                datasets: [
                  {
                    label: "Tip Amount ($degen)",
                    data: weeklyTips.map((tip: WeeklyTip) => tip.amount),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
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
        state: { fid, username, weeklyTips },
      };
    }
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
