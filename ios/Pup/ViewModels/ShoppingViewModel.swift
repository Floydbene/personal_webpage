import Foundation
import Supabase

enum ShoppingFilter: String, CaseIterable {
    case needed = "Needed"
    case purchased = "Purchased"
    case all = "All"

    func matches(_ item: ShoppingItem) -> Bool {
        switch self {
        case .needed: return !item.purchased
        case .purchased: return item.purchased
        case .all: return true
        }
    }
}

@Observable
final class ShoppingViewModel {
    var items: [ShoppingItem] = []
    var activeFilter: ShoppingFilter = .needed
    var isLoading = false
    var error: String?

    private let auth: AuthManager

    init(auth: AuthManager) {
        self.auth = auth
    }

    var filteredItems: [ShoppingItem] {
        items.filter { activeFilter.matches($0) }
    }

    func count(for filter: ShoppingFilter) -> Int {
        items.filter { filter.matches($0) }.count
    }

    var totalEstimatedCost: Double {
        items.filter { !$0.purchased }
            .compactMap { $0.estimatedCost }
            .reduce(0, +)
    }

    @MainActor
    func loadItems() async {
        isLoading = true
        error = nil
        do {
            items = try await auth.client.from("shopping_items")
                .select()
                .order("created_at", ascending: false)
                .execute()
                .value
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func createItem(name: String, store: String? = nil, estimatedCost: Double? = nil, quantity: Double? = nil, unit: String? = nil, neededBy: String? = nil) async {
        guard let userId = auth.userId, let email = auth.userEmail else { return }
        let payload = CreateShoppingItemPayload(
            userId: userId,
            name: name,
            createdBy: email,
            store: store,
            estimatedCost: estimatedCost,
            quantity: quantity,
            unit: unit,
            neededBy: neededBy
        )
        do {
            try await auth.client.from("shopping_items")
                .insert(payload)
                .execute()
            await loadItems()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func togglePurchased(item: ShoppingItem) async {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime]

        var payload = UpdateShoppingItemPayload()
        payload.purchased = !item.purchased
        payload.updatedAt = isoFormatter.string(from: Date())

        if !item.purchased {
            payload.purchasedBy = auth.userEmail
            payload.purchasedAt = isoFormatter.string(from: Date())
        } else {
            payload.purchasedBy = nil
            payload.purchasedAt = nil
        }

        do {
            try await auth.client.from("shopping_items")
                .update(payload)
                .eq("id", value: item.id)
                .execute()
            await loadItems()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func updateItem(id: String, fields: UpdateShoppingItemPayload) async {
        do {
            var payload = fields
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime]
            payload.updatedAt = isoFormatter.string(from: Date())

            try await auth.client.from("shopping_items")
                .update(payload)
                .eq("id", value: id)
                .execute()
            await loadItems()
        } catch {
            self.error = error.localizedDescription
        }
    }

    @MainActor
    func deleteItem(id: String) async {
        do {
            try await auth.client.from("shopping_items")
                .delete()
                .eq("id", value: id)
                .execute()
            items.removeAll { $0.id == id }
        } catch {
            self.error = error.localizedDescription
        }
    }
}
