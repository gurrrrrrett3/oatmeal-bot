export const level = {
    /**
     * Find how much xp you need for a certain level
     * @param {Number} newLevel 
     * @returns How much xp you need for a certain level
     */
    xpNeeded: (newLevel) => 5 * (newLevel ^ 2) + 50 * newLevel + 100,
    /**
     * Function to find how much xp to guve
     * @returns Random Number
     */
    giveXP: () => Math.ceil(Math.random() * 10) + 15

}