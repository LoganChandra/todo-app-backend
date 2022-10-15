export const getStatus = (inp: Date): string => {
    try {
        let date = new Date(inp)
        let one_day = 1000 * 60 * 60 * 24;
        let serverDateTime = new Date();
        let diff = Math.ceil((date.getTime() - serverDateTime.getTime()) / one_day);

        // CHECKING FOR STATUS
        if (diff < 0)
            return "Overdue"
        if (diff <= 7)
            return "Due soon"
        return "Not urgent"

    } catch (e) {
        throw new Error(JSON.stringify(e));
    }
}