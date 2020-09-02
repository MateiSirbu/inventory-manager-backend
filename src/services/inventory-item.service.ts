import { InventoryItem } from "../entities/inventory-item.entity";
import { EntityManager, wrap } from "mikro-orm";

export {
    getInventoryItems,
    getInventoryItem,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
    countInventoryItems
};

async function countInventoryItems(em: EntityManager) {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    try {
        const count = await em.count(InventoryItem, {});
        return count;
    } catch (ex) {
        return ex;
    }
}

async function getInventoryItems(
    em: EntityManager,
    page: number,
    limit: number
): Promise<Error | InventoryItem[]> {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    try {
        const items = await em.find(
            InventoryItem,
            {},
            { limit: limit, offset: (page - 1) * limit }
        );
        return items;
    } catch (ex) {
        return ex;
    }
}

async function getInventoryItem(
    em: EntityManager,
    id: string
): Promise<Error | InventoryItem | null> {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    if (!id || typeof id !== "string") return Error("invalid params");

    try {
        const item = await em.findOne(InventoryItem, { id: id });
        return item;
    } catch (ex) {
        return ex;
    }
}

async function removeInventoryItem(
    em: EntityManager,
    id: string
): Promise<Error | void> {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    if (!id || typeof id !== "string") return Error("invalid params");

    try {
        const item = await em.findOneOrFail(InventoryItem, { id });
        await em.removeAndFlush(item);
    } catch (ex) {
        return ex;
    }
}

async function updateInventoryItem(
    em: EntityManager,
    inventoryItem: Partial<InventoryItem>
): Promise<Error | InventoryItem> {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    if (!inventoryItem || typeof inventoryItem !== "object" || !inventoryItem.id)
        return Error("invalid params");

    try {
        const item = await em.findOneOrFail(InventoryItem, {
            id: inventoryItem.id,
        });
        wrap(item).assign(inventoryItem);
        await em.persistAndFlush(item);
        return item;
    } catch (ex) {
        return ex;
    }
}

async function addInventoryItem(
    em: EntityManager,
    inventoryItem: Partial<InventoryItem>
): Promise<Error | InventoryItem> {
    if (!(em instanceof EntityManager)) return Error("invalid request");

    if (!inventoryItem || typeof inventoryItem !== "object" || inventoryItem.id)
        return Error("invalid params");

    try {
        const item = new InventoryItem(inventoryItem);
        await em.persistAndFlush(item);
        return item;
    } catch (ex) {
        return ex;
    }
}
