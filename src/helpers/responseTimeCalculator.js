module.exports = (start) => {
    const diffTime = process.hrtime(start);
    return (diffTime[0] * 1000 + (diffTime[1] / 1e6)).toFixed(2) + 'ms';
};