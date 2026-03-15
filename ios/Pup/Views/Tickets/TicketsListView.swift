import SwiftUI

struct TicketsListView: View {
    @Environment(TicketsViewModel.self) private var vm
    @Environment(\.appTheme) private var theme
    @State private var selectedTicket: Ticket?

    var body: some View {
        @Bindable var vm = vm

        NavigationStack {
            VStack(spacing: 0) {
                // Create ticket
                CreateTicketView { title in
                    await vm.createTicket(title: title)
                }
                .padding(.horizontal)
                .padding(.top, 12)

                // Filter tabs
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(TicketFilter.allCases, id: \.self) { filter in
                            Button {
                                vm.activeFilter = filter
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
                                .background(
                                    vm.activeFilter == filter
                                    ? theme.primary.opacity(0.12) : Color.clear,
                                    in: Capsule()
                                )
                            }
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 10)
                }

                if let error = vm.error {
                    ErrorBanner(message: error) { vm.error = nil }
                }

                // Ticket list
                if vm.isLoading && vm.tickets.isEmpty {
                    Spacer()
                    ProgressView()
                        .tint(theme.primary)
                    Spacer()
                } else if vm.filteredTickets.isEmpty {
                    Spacer()
                    Text(
                        vm.activeFilter == .all
                        ? "No tickets yet. Add one above!"
                        : "No \(vm.activeFilter.rawValue.lowercased()) tickets."
                    )
                    .font(.subheadline)
                    .foregroundStyle(theme.textMuted)
                    Spacer()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 6) {
                            ForEach(vm.filteredTickets) { ticket in
                                TicketRowView(
                                    ticket: ticket,
                                    displayName: vm.displayName
                                )
                                .onTapGesture { selectedTicket = ticket }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 20)
                    }
                    .refreshable {
                        await vm.loadTickets()
                    }
                }
            }
            .background(theme.background)
            .navigationTitle("Tickets")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .sheet(item: $selectedTicket) { ticket in
                TicketDetailView(
                    ticket: ticket,
                    users: vm.users,
                    displayName: vm.displayName,
                    onUpdate: { payload in
                        await vm.updateTicket(id: ticket.id, fields: payload)
                    },
                    onDelete: {
                        await vm.deleteTicket(id: ticket.id)
                    }
                )
            }
            .task {
                await vm.loadTickets()
                await vm.loadUsers()
            }
        }
    }
}
