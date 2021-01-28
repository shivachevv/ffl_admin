function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        .indexOf(dayName.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) return;
    refDate.setHours(0, 0, 0, 0);
    refDate.setDate(refDate.getDate() + !!excludeToday +
        (dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);
    return new Date(refDate.getTime() - (60 * 1000)) // RETURN THE DESIRED DAY MINUS 1 MINUTE
}

export default {
    next: getNextDayOfTheWeek("tue").toLocaleString(),
    now: new Date().toLocaleString()
}