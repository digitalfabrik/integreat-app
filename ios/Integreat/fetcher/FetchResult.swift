import Foundation

extension Formatter {
  static let iso8601: DateFormatter = {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXXXX"
    return formatter
  }()
}

extension Date {
  var iso8601: String {
    return Formatter.iso8601.string(from: self)
  }
}

class FetchResult {
  private(set) var url: String
  private(set) var lastUpdate: Date
  private(set) var alreadyExisted: Bool
  private(set) var errorMessage: String?
  
  init(url: String, lastUpdate: Date, alreadyExisted: Bool, errorMessage: String?) {
  self.url = url;
  self.lastUpdate = lastUpdate;
  self.alreadyExisted = alreadyExisted;
  self.errorMessage = errorMessage;
  }
}
