import SwiftUI

struct ShoppingListView: View {
    @Environment(ShoppingViewModel.self) private var vm
    @Environment(\.appTheme) private var theme
    @State private var selectedItem: ShoppingItem?
    @Namespace private var filterNamespace

    var body: some View {
        @Bindable var vm = vm

        NavigationStack {
            VStack(spacing: 0) {
                CreateShoppingItemView { name in
                    await vm.createItem(name: name)
                }
                .padding(.horizontal)
                .padding(.top, 12)

                // Filter tabs + cost badge
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(ShoppingFilter.allCases, id: \.self) { filter in
                            Button {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                    vm.activeFilter = filter
                                }
                            } label: {
                                HStack(spacing: 4) {
                                    Text(filter.rawValue)
                                        .font(.caption)
                                        .fontWeight(vm.activeFilter == filter ? .semibold : .regular)
                                    Text("\(vm.count(for: filter))")
                                        .font(.caption2)
                                        .foregroundStyle(
                                            vm.activeFilter == filter
                                            ? theme.primary : theme.textMuted
                                        )
                                }
                                .foregroundStyle(
                                    vm.activeFilter == filter
                                    ? theme.primary : theme.textSecondary
                                )
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background {
                                    if vm.activeFilter == filter {
                                        Capsule()
                                            .fill(theme.primary.opacity(0.12))
                                            .matchedGeometryEffect(id: "shoppingFilter", in: filterNamespace)
                                    }
                                }
                            }
                        }

                        if vm.totalEstimatedCost > 0 {
                            Text(String(format: "£%.2f", vm.totalEstimatedCost))
                                .font(.caption2)
                                .fontWeight(.semibold)
                                .foregroundStyle(theme.accent)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(theme.accent.opacity(0.12), in: Capsule())
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 10)
                }

                if let error = vm.error {
                    ErrorBanner(message: error) { vm.error = nil }
                }

                // Item list
                if vm.isLoading && vm.items.isEmpty {
                    Spacer()
                    ProgressView()
                        .tint(theme.primary)
                    Spacer()
                } else if vm.filteredItems.isEmpty {
                    Spacer()
                    ContentUnavailableView {
                        Label("No Items", systemImage: "cart")
                    } description: {
                        Text(
                            vm.activeFilter == .all
                            ? "No shopping items yet. Add one above!"
                            : "No \(vm.activeFilter.rawValue.lowercased()) items."
                        )
                    }
                    .foregroundStyle(theme.textMuted)
                    Spacer()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 8) {
                            ForEach(vm.filteredItems) { item in
                                ShoppingItemRowView(item: item) {
                                    await vm.togglePurchased(item: item)
                                }
                                .onTapGesture { selectedItem = item }
                            }
                        }
                        .padding(.horizontal)
                    }
                    .refreshable {
                        await vm.loadItems()
                    }
                }
            }
            .background(theme.background)
            .navigationTitle("Shopping")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .sheet(item: $selectedItem) { item in
                ShoppingItemDetailView(
                    item: item,
                    onUpdate: { payload in
                        await vm.updateItem(id: item.id, fields: payload)
                    },
                    onDelete: {
                        await vm.deleteItem(id: item.id)
                    }
                )
                .presentationDragIndicator(.visible)
                .presentationCornerRadius(20)
            }
            .task {
                await vm.loadItems()
            }
        }
    }
}
