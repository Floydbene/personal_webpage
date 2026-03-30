import SwiftUI

struct ShoppingItemDetailView: View {
    let item: ShoppingItem
    let onUpdate: (UpdateShoppingItemPayload) async -> Void
    let onDelete: () async -> Void

    @Environment(\.appTheme) private var theme
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var store: String
    @State private var estimatedCost: String
    @State private var quantityText: String
    @State private var selectedUnit: UnitSelection
    @State private var customUnit: String
    @State private var neededBy: Date
    @State private var hasNeededBy: Bool
    @State private var purchased: Bool
    @State private var showDeleteConfirm = false

    private enum UnitSelection: Equatable {
        case none
        case preset(ShoppingUnit)
        case custom
    }

    init(
        item: ShoppingItem,
        onUpdate: @escaping (UpdateShoppingItemPayload) async -> Void,
        onDelete: @escaping () async -> Void
    ) {
        self.item = item
        self.onUpdate = onUpdate
        self.onDelete = onDelete
        self._name = State(initialValue: item.name)
        self._store = State(initialValue: item.store ?? "")
        self._estimatedCost = State(initialValue: item.estimatedCost.map { String(format: "%.2f", $0) } ?? "")

        let isWhole = item.quantity == item.quantity.rounded(.towardZero) && item.quantity.truncatingRemainder(dividingBy: 1) == 0
        self._quantityText = State(initialValue: isWhole ? String(Int(item.quantity)) : String(format: "%.2f", item.quantity))

        // Determine unit selection from existing item
        if let unit = item.unit, !unit.isEmpty {
            if let preset = ShoppingUnit.allCases.first(where: { $0.label == unit }) {
                self._selectedUnit = State(initialValue: .preset(preset))
                self._customUnit = State(initialValue: "")
            } else {
                self._selectedUnit = State(initialValue: .custom)
                self._customUnit = State(initialValue: unit)
            }
        } else {
            self._selectedUnit = State(initialValue: .none)
            self._customUnit = State(initialValue: "")
        }

        self._neededBy = State(initialValue: item.neededBy.flatMap { Date.fromDateString($0) } ?? Date())
        self._hasNeededBy = State(initialValue: item.neededBy != nil)
        self._purchased = State(initialValue: item.purchased)
    }

    private var resolvedUnit: String? {
        switch selectedUnit {
        case .none:
            return nil
        case .preset(let unit):
            return unit.label
        case .custom:
            let trimmed = customUnit.trimmingCharacters(in: .whitespacesAndNewlines)
            return trimmed.isEmpty ? nil : trimmed
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Name + Store
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Name")
                        TextField("Item name", text: $name)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))

                        sectionHeader("Store")
                        TextField("Where to buy (optional)", text: $store)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                    }
                    .padding(16)
                    .premiumCard()

                    // Cost + Quantity + Unit
                    VStack(alignment: .leading, spacing: 12) {
                        sectionHeader("Estimated Cost")
                        TextField("0.00", text: $estimatedCost)
                            .keyboardType(.decimalPad)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))

                        sectionHeader("Quantity")
                        TextField("1", text: $quantityText)
                            .keyboardType(.decimalPad)
                            .foregroundStyle(theme.text)
                            .padding(10)
                            .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))

                        sectionHeader("Unit")
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                unitCapsule("None", selected: selectedUnit == .none) {
                                    selectedUnit = .none
                                }

                                ForEach(ShoppingUnit.allCases) { unit in
                                    unitCapsule(unit.label, selected: selectedUnit == .preset(unit)) {
                                        selectedUnit = .preset(unit)
                                    }
                                }

                                unitCapsule("Custom", selected: selectedUnit == .custom) {
                                    selectedUnit = .custom
                                }
                            }
                        }

                        if selectedUnit == .custom {
                            TextField("Unit name", text: $customUnit)
                                .foregroundStyle(theme.text)
                                .padding(10)
                                .background(theme.backgroundSecondary, in: RoundedRectangle(cornerRadius: 8))
                        }
                    }
                    .padding(16)
                    .premiumCard()

                    // Needed By
                    VStack(alignment: .leading, spacing: 12) {
                        Toggle(isOn: $hasNeededBy) {
                            sectionHeader("Needed By")
                        }
                        .tint(theme.primary)

                        if hasNeededBy {
                            DatePicker(
                                "Date",
                                selection: $neededBy,
                                displayedComponents: .date
                            )
                            .datePickerStyle(.compact)
                            .tint(theme.primary)
                        }
                    }
                    .padding(16)
                    .premiumCard()

                    // Purchased toggle
                    VStack(alignment: .leading, spacing: 12) {
                        Toggle(isOn: $purchased) {
                            sectionHeader("Purchased")
                        }
                        .tint(theme.primary)
                    }
                    .padding(16)
                    .premiumCard()

                    // Delete
                    Button(role: .destructive) {
                        showDeleteConfirm = true
                    } label: {
                        HStack {
                            Image(systemName: "trash")
                            Text("Delete Item")
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                    }
                    .foregroundStyle(Color(hex: "#ef4444"))
                    .padding(4)
                    .background(Color(hex: "#ef4444").opacity(0.08), in: RoundedRectangle(cornerRadius: 14))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color(hex: "#ef4444").opacity(0.2), lineWidth: 0.5)
                    )
                }
                .padding()
            }
            .background(theme.background)
            .navigationTitle("Edit Item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(theme.textMuted)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            var payload = UpdateShoppingItemPayload()
                            if name != item.name { payload.name = name }
                            let trimmedStore = store.trimmingCharacters(in: .whitespacesAndNewlines)
                            if trimmedStore != (item.store ?? "") {
                                payload.store = trimmedStore.isEmpty ? nil : trimmedStore
                            }
                            let costVal = Double(estimatedCost)
                            if costVal != item.estimatedCost {
                                payload.estimatedCost = costVal
                            }
                            let qtyVal = Double(quantityText) ?? 1
                            if qtyVal != item.quantity { payload.quantity = qtyVal }
                            let newUnit = resolvedUnit
                            if newUnit != item.unit { payload.unit = newUnit }
                            if hasNeededBy {
                                payload.neededBy = neededBy.dateInputString
                            } else if item.neededBy != nil {
                                payload.neededBy = ""
                            }
                            if purchased != item.purchased { payload.purchased = purchased }
                            await onUpdate(payload)
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(theme.primary)
                }
            }
            .alert("Delete Item?", isPresented: $showDeleteConfirm) {
                Button("Delete", role: .destructive) {
                    Task {
                        await onDelete()
                        dismiss()
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This action cannot be undone.")
            }
        }
    }

    private func sectionHeader(_ text: String) -> some View {
        Text(text)
            .font(.caption)
            .foregroundStyle(theme.textMuted)
            .fontWeight(.semibold)
    }

    private func unitCapsule(_ label: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.caption)
                .fontWeight(.medium)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .foregroundStyle(selected ? .white : theme.text)
                .background(selected ? theme.primary : theme.backgroundSecondary, in: Capsule())
                .overlay(Capsule().stroke(selected ? theme.primary : theme.border, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}
