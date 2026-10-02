export default function ReminderBanner({ message }) {
  return <div className={"reminder-banner" + (message ? " show" : "")}>{message}</div>;
}
