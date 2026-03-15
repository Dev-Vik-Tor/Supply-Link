#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

// ── Data models ──────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub origin: String,
    pub owner: Address,
    pub timestamp: u64,
    pub authorized_actors: Vec<Address>,
}

#[contracttype]
#[derive(Clone)]
pub struct TrackingEvent {
    pub product_id: String,
    pub location: String,
    pub actor: Address,
    pub timestamp: u64,
    pub event_type: String, // HARVEST | PROCESSING | SHIPPING | RETAIL
    pub metadata: String,   // JSON string
}

// ── Storage keys ─────────────────────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Product(String),
    Events(String),
}

// ── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct SupplyLinkContract;

#[contractimpl]
impl SupplyLinkContract {
    /// Register a new product on-chain.
    pub fn register_product(
        env: Env,
        id: String,
        name: String,
        origin: String,
        owner: Address,
    ) -> Product {
        owner.require_auth();
        let product = Product {
            id: id.clone(),
            name,
            origin,
            owner,
            timestamp: env.ledger().timestamp(),
            authorized_actors: Vec::new(&env),
        };
        env.storage()
            .persistent()
            .set(&DataKey::Product(id), &product);
        product
    }

    /// Add a tracking event for a product.
    pub fn add_tracking_event(
        env: Env,
        product_id: String,
        location: String,
        event_type: String,
        metadata: String,
    ) -> TrackingEvent {
        let product: Product = env
            .storage()
            .persistent()
            .get(&DataKey::Product(product_id.clone()))
            .expect("product not found");

        // caller must be owner or an authorized actor
        let caller = product.owner.clone();
        caller.require_auth();

        let event = TrackingEvent {
            product_id: product_id.clone(),
            location,
            actor: caller,
            timestamp: env.ledger().timestamp(),
            event_type,
            metadata,
        };

        let mut events: Vec<TrackingEvent> = env
            .storage()
            .persistent()
            .get(&DataKey::Events(product_id.clone()))
            .unwrap_or_else(|| Vec::new(&env));

        events.push_back(event.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Events(product_id), &events);

        event
    }

    /// Get product details.
    pub fn get_product(env: Env, id: String) -> Product {
        env.storage()
            .persistent()
            .get(&DataKey::Product(id))
            .expect("product not found")
    }

    /// Get all tracking events for a product.
    pub fn get_tracking_events(env: Env, product_id: String) -> Vec<TrackingEvent> {
        env.storage()
            .persistent()
            .get(&DataKey::Events(product_id))
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Transfer product ownership.
    pub fn transfer_ownership(env: Env, product_id: String, new_owner: Address) -> bool {
        let mut product: Product = env
            .storage()
            .persistent()
            .get(&DataKey::Product(product_id.clone()))
            .expect("product not found");

        product.owner.require_auth();
        product.owner = new_owner;
        env.storage()
            .persistent()
            .set(&DataKey::Product(product_id), &product);
        true
    }

    /// Authorize an actor to add events for a product.
    pub fn add_authorized_actor(env: Env, product_id: String, actor: Address) -> bool {
        let mut product: Product = env
            .storage()
            .persistent()
            .get(&DataKey::Product(product_id.clone()))
            .expect("product not found");

        product.owner.require_auth();
        product.authorized_actors.push_back(actor);
        env.storage()
            .persistent()
            .set(&DataKey::Product(product_id), &product);
        true
    }
}
