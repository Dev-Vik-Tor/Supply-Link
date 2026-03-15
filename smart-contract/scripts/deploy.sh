#!/usr/bin/env bash
# Deploy supply-link contract to Stellar testnet
set -euo pipefail

WASM="target/wasm32-unknown-unknown/release/supply_link.wasm"
NETWORK="${NETWORK:-testnet}"
SOURCE="${SOURCE:?Set SOURCE to your Stellar account alias}"

echo "Building..."
cargo build --target wasm32-unknown-unknown --release

echo "Deploying to $NETWORK..."
stellar contract deploy \
  --wasm "$WASM" \
  --network "$NETWORK" \
  --source "$SOURCE"
