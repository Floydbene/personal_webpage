import Foundation
import Supabase

private let dogNames = [
    "Biscuit", "Mochi", "Waffle", "Nugget", "Peanut",
    "Dumpling", "Pretzel", "Cinnamon", "Truffle", "Pudding",
    "Maple", "Bean", "Noodle", "Pickles", "Tofu",
    "Butterscotch", "Cocoa", "Ginger", "Pepper", "Clementine",
]

@Observable
final class DogAccessViewModel {
    var access: DogAccessResponse?
    var dogName: String = ""
    var isLoading = false
    var error: String?
    var minutesLeft: Int = 0

    private let auth: AuthManager
    private var nameTimer: Timer?
    private var accessTimer: Timer?

    init(auth: AuthManager) {
        self.auth = auth
        updateDogName()
    }

    func updateDogName() {
        let interval: Double = 3 * 60 * 1000 // 3 minutes in ms
        let now = Date().timeIntervalSince1970 * 1000
        let cycle = Int(now / interval)
        let index = cycle % dogNames.count
        dogName = dogNames[index]
    }

    func startTimers() {
        // Name rotation timer
        nameTimer?.invalidate()
        nameTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            self?.updateDogName()
        }

        // Access refresh timer (every 60s)
        accessTimer?.invalidate()
        accessTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self else { return }
            Task { await self.loadAccess() }
        }
    }

    func stopTimers() {
        nameTimer?.invalidate()
        accessTimer?.invalidate()
    }

    func updateMinutesLeft() {
        guard let windowEndDate = access?.windowEndDate else {
            minutesLeft = 0
            return
        }
        minutesLeft = max(0, Int(ceil(windowEndDate.timeIntervalSince(Date()) / 60)))
    }

    @MainActor
    func loadAccess() async {
        isLoading = true
        error = nil
        do {
            access = try await auth.client.rpc("get_dog_access")
                .execute()
                .value
            updateMinutesLeft()
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }
}
