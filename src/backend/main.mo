import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Queue "mo:core/Queue";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

// Catalog-specific diagnostic instructions for error handling and debugging
// Error Handling: The current implementation uses Runtime.trap() for error scenarios. Consider replacing these with a more user-friendly error handling mechanism, such as returning custom error variants, to improve debugging and user experience.
// Logging: There are no logs or debug outputs in the current implementation. Adding logging statements could help trace issues during development and production.
// Testing: Ensure that break notifications are thoroughly tested, especially timing-related functionality, as this can be a common source of bugs.

actor {
  type Note = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      if (note1.timestamp < note2.timestamp) { #less } else { if (note1.timestamp == note2.timestamp) { #equal } else { #greater } };
    };
  };

  type BreakReminder = {
    interval : Int;
    lastReminder : Time.Time;
  };

  let reminders = Map.empty<Principal, BreakReminder>();
  let notificationQueue = Queue.empty<Text>();
  var nextNoteId = 0;

  public shared ({ caller }) func setBreakReminder(interval : Int) : async () {
    let reminder : BreakReminder = {
      interval;
      lastReminder = Time.now();
    };
    reminders.add(caller, reminder);
  };

  func checkAndSendNotifications() {
    let now = Time.now();
    for ((user, reminder) in reminders.entries()) {
      if (now - reminder.lastReminder >= reminder.interval) {
        let notification = "Time for a break!";
        notificationQueue.pushBack(notification);
        let updatedReminder : BreakReminder = {
          interval = reminder.interval;
          lastReminder = now;
        };
        reminders.add(user, updatedReminder);
      };
    };
  };

  public shared ({ caller }) func processNotifications() : async Time.Time {
    checkAndSendNotifications();
    Time.now();
  };

  public query ({ caller }) func getNextNotification() : async ?Text {
    notificationQueue.popFront();
  };

  let notes = Map.empty<Principal, Map.Map<Nat, Note>>();

  public shared ({ caller }) func createNote(content : Text) : async Note {
    let note : Note = {
      id = nextNoteId;
      content;
      timestamp = Time.now();
    };

    switch (notes.get(caller)) {
      case (null) {
        let newUserNotes = Map.empty<Nat, Note>();
        newUserNotes.add(nextNoteId, note);
        notes.add(caller, newUserNotes);
      };
      case (?userNotes) {
        userNotes.add(nextNoteId, note);
      };
    };

    nextNoteId += 1;
    note;
  };

  public query ({ caller }) func getNotes() : async [Note] {
    switch (notes.get(caller)) {
      case (null) { [] };
      case (?userNotes) { userNotes.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func editNote(id : Nat, newContent : Text) : async Note {
    switch (notes.get(caller)) {
      case (null) { Runtime.trap("No notes found for this user") };
      case (?userNotes) {
        switch (userNotes.get(id)) {
          case (null) { Runtime.trap("Note not found") };
          case (?oldNote) {
            let updatedNote : Note = {
              id;
              content = newContent;
              timestamp = Time.now();
            };
            userNotes.add(id, updatedNote);
            updatedNote;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async () {
    switch (notes.get(caller)) {
      case (null) { Runtime.trap("No notes found for this user") };
      case (?userNotes) {
        if (not userNotes.containsKey(id)) {
          Runtime.trap("Note not found");
        };
        userNotes.remove(id);
      };
    };
  };
};
