import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../backend/contact-api/shared/catalog.json" with { type: "json" };
import {
  cartTotalMinor,
  changeQuantity,
  normalizeCart,
  normalizePending,
  priceRange,
  removeLine,
} from "../src/shop/pricing.ts";

const products = catalog.products;
const product = (id) => products.find((p) => p.id === id);

test("priceRange spans the cheapest and dearest package", () => {
  assert.deepEqual(priceRange(product(1)), {
    fromMinor: 180000,
    toMinor: 400000,
    openEnded: true,
    single: false,
  });
  assert.deepEqual(priceRange(product(2)), {
    fromMinor: 150000,
    toMinor: 150000,
    openEnded: false,
    single: true,
  });
});

test("normalizeCart gives legacy lines the cheapest package", () => {
  assert.deepEqual(
    normalizeCart([
      { id: 1, qty: 2 },
      { id: 3, qty: 1 },
    ], products),
    [
      { id: 1, packageId: "start", qty: 2 },
      { id: 3, packageId: "start", qty: 1 },
    ],
  );
});

test("normalizeCart drops invalid lines and merges repeats up to 99", () => {
  assert.deepEqual(
    normalizeCart([
      { id: 1, packageId: "nope", qty: 1 },
      { id: 99, packageId: "start", qty: 1 },
      { id: 2, packageId: "standard", qty: 0 },
      { id: 1, packageId: "pro", qty: 60 },
      { id: 1, packageId: "pro", qty: 60 },
    ], products),
    [{ id: 1, packageId: "pro", qty: 99 }],
  );
  assert.deepEqual(normalizeCart({ id: 1 }, products), []);
});

test("changeQuantity keeps package lines apart and caps at 99", () => {
  let cart = changeQuantity([], products, 1, "start", 1);
  cart = changeQuantity(cart, products, 1, "pro", 1);
  assert.deepEqual(cart, [
    { id: 1, packageId: "start", qty: 1 },
    { id: 1, packageId: "pro", qty: 1 },
  ]);
  const full = [{ id: 1, packageId: "pro", qty: 99 }];
  assert.deepEqual(changeQuantity(full, products, 1, "pro", 1), full);
  assert.deepEqual(changeQuantity(cart, products, 1, "start", -1), [
    { id: 1, packageId: "pro", qty: 1 },
  ]);
  assert.equal(changeQuantity(cart, products, 1, "nope", 1), cart);
});

test("removeLine removes only the given package", () => {
  const cart = [
    { id: 1, packageId: "start", qty: 1 },
    { id: 1, packageId: "pro", qty: 1 },
  ];
  assert.deepEqual(removeLine(cart, 1, "pro"), [
    { id: 1, packageId: "start", qty: 1 },
  ]);
});

test("cartTotalMinor prices packages and defaults missing ones", () => {
  assert.equal(
    cartTotalMinor([
      { id: 1, packageId: "pro", qty: 1 },
      { id: 2, packageId: "standard", qty: 2 },
    ], products),
    700000,
  );
  assert.equal(cartTotalMinor([{ id: 1, qty: 1 }], products), 180000);
});

test("normalizePending keeps legacy items unchanged for idempotent replay", () => {
  assert.deepEqual(normalizePending([{ id: 1, qty: 1 }], products), [
    { id: 1, qty: 1 },
  ]);
  assert.equal(
    normalizePending([{ id: 1, packageId: "nope", qty: 1 }], products),
    null,
  );
  assert.equal(
    normalizePending(
      Array.from({ length: 9 }, () => ({ id: 1, qty: 1 })),
      products,
    ),
    null,
  );
});
