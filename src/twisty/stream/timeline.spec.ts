import { BareBlockMove } from "../../alg";
import { algPartToStringForTesting } from "../../alg/traversal";
import { toTimeline } from "./timeline";

const moves = [
  { timeStamp: 4356, move: BareBlockMove("L")},
  { timeStamp: 4358, move: BareBlockMove("R", -1)},
  { timeStamp: 4360, move: BareBlockMove("L")},
  { timeStamp: 4417, move: BareBlockMove("R", -1)},
  { timeStamp: 4777, move: BareBlockMove("D", -1)},
  { timeStamp: 4836, move: BareBlockMove("R", -1)},
  { timeStamp: 4837, move: BareBlockMove("L")},
  { timeStamp: 4838, move: BareBlockMove("L")},
  { timeStamp: 4897, move: BareBlockMove("R", -1)},
];

// 0   1   2   3   4   5   6   7   8   9
//  ---R---
//          ---U--
//                --R'-
//                     --U'--
//                            ---R--R--

const moves2 = [
  { timeStamp: 100, move: BareBlockMove("R")},
  { timeStamp: 300, move: BareBlockMove("U")},
  { timeStamp: 450, move: BareBlockMove("R", -1)},
  { timeStamp: 550, move: BareBlockMove("U", -1)},
  { timeStamp: 575, move: BareBlockMove("D")},
  { timeStamp: 750, move: BareBlockMove("R")},
  { timeStamp: 800, move: BareBlockMove("R")},
];

describe("Timeline", () => {
  it("should convert", () => {
    expect(toTimeline(moves2).map((t) => `@${t.start}-${t.end} ${algPartToStringForTesting(t.event.move)}`).join("\n")).toBe("@0-200 R\n@200-375 U\n@375-500 R'\n@500-650 U'\n@475-662.5 D\n@662.5-850 R2");
    expect(toTimeline(moves).map((t) => `@${t.start}-${t.end} ${algPartToStringForTesting(t.event.move)}`).join("\n")).toBe("@4256-4456 L2\n@4258-4458 R2'\n@4677-4806.5 D'\n@4806.5-4936 R2'\n@4737-4937 L2");
  });
});
