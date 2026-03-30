import SwiftUI

struct ShoppingItemRowView: View {
    let item: ShoppingItem
    let onToggle: () async -> Void
    @Environment(\.appTheme) private var theme

    var body: some View {
        HStack(spacing: 14) {
            // Checkbox
            Button {
                Task { await onToggle() }
            } label: {
                Circle()
                    .fill(item.purchased ? theme.primary : .clear)
                    .frame(width: 24, height: 24)
                    .overlay(
                        Circle()
                            .stroke(item.purchased ? theme.primary : theme.border, lineWidth: 2)
                    )
                    .overlay {
                        if item.purchased {
                            Image(systemName: "checkmark")
                                .font(.caption2.weight(.bold))
                                .foregroundStyle(.white)
                        }
                    }
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 4) {
                Text(item.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundStyle(item.purchased ? theme.textMuted : theme.text)
                    .strikethrough(item.purchased)

                HStack(spacing: 8) {
                    if let store = item.store, !store.isEmpty {
                        HStack(spacing: 3) {
                            Image(systemName: "storefront")
                                .font(.system(size: 9))
                            Text(store)
                        }
                        .font(.caption2)
                        .foregroundStyle(theme.textMuted)
                    }

                    if let cost = item.estimatedCost {
                        Text(String(format: "£%.2f", cost))
                            .font(.caption2)
                            .fontWeight(.medium)
                            .foregroundStyle(theme.accent)
                    }

                    if let qtyLabel = ShoppingUnit.formatQuantity(item.quantity, unit: item.unit) {
                        Text(qtyLabel)
                            .font(.caption2)
                            .fontWeight(.semibold)
                            .foregroundStyle(theme.primary)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(theme.primary.opacity(0.12), in: Capsule())
                    }

                    if let neededBy = item.neededBy, let date = Date.fromDateString(neededBy) {
                        Text(date.shortDate)
                            .font(.caption2)
                            .foregroundStyle(
                                date < Date() && !item.purchased
                                ? Color(hex: "#ef4444") : theme.textMuted
                            )
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(theme.textMuted)
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 12)
        .premiumCard()
    }
}
