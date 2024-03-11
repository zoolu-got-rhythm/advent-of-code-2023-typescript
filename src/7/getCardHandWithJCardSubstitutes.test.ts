import { getCardHandWithJCardSubstitutes } from "./index";

test("3 + 2 === 5", () => {
    expect(3 + 2).toBe(5);
});

test("32T3K === 32T3K", () => {
    expect(getCardHandWithJCardSubstitutes("32T3K")).toBe("32T3K");
});

test("32T3J === 32T33", () => {
    expect(getCardHandWithJCardSubstitutes("32T3J")).toBe("32T33");
});

test("JJJJJ === AAAAA", () => {
    expect(getCardHandWithJCardSubstitutes("JJJJJ")).toBe("AAAAA");
});

test("1253J === 12535", () => {
    expect(getCardHandWithJCardSubstitutes("1253J")).toBe("12535");
});