import SwiftUI

struct CalendarView: View {
    @Environment(CalendarViewModel.self) private var vm
    @Environment(\.appTheme) private var theme
    @State private var selectedDay: Date?
    @State private var showCreateBlock = false

    private var monthLabel: String {
        guard let firstDate = vm.calendarDates.first else { return "" }
        return firstDate.monthYearString
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Month label
                HStack {
                    Text(monthLabel)
                        .font(.title3)
                        .fontWeight(.semibold)
                        .foregroundStyle(theme.text)
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 12)

                // Calendar grid
                CalendarGridView(
                    dates: vm.calendarDates,
                    blocks: vm.scheduleBlocks,
                    tickets: vm.tickets,
                    selectedDate: $selectedDay
                )
                .padding(.horizontal, 8)
                .padding(.top, 8)

                Spacer()
            }
            .background(theme.background)
            .navigationTitle("Calendar")
            .toolbarBackground(theme.cardBackground, for: .navigationBar)
            .toolbarColorScheme(theme.id == "light" ? .light : .dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showCreateBlock = true
                    } label: {
                        Image(systemName: "plus")
                            .fontWeight(.semibold)
                            .foregroundStyle(theme.primary)
                    }
                }
            }
            .sheet(item: $selectedDay) { date in
                DayDetailView(date: date)
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(20)
            }
            .sheet(isPresented: $showCreateBlock) {
                CreateScheduleBlockView()
                    .presentationDragIndicator(.visible)
                    .presentationCornerRadius(20)
            }
            .task {
                await vm.loadData()
            }
        }
    }
}

extension Date: @retroactive Identifiable {
    public var id: TimeInterval { timeIntervalSinceReferenceDate }
}
