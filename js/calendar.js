function updateCalendar(deathCause) {
    // calendar display

    if (d3.select('#svg-cal')) {
        d3.select('#svg-cal').remove();
    }

    if (d3.select('#svg-cal-scale')) {
        d3.select('#svg-cal-scale').remove();
    }

    var calWidth = 300;
    var calHeight = calWidth;
    var calPaddingHor = calWidth * 0.05;
    var calPaddingVer = calHeight * 0.1;

    var barWidth = (calWidth - 2 * calPaddingHor) / 7;
    var barHeight = calHeight * 0.475;
    var barPadding = barWidth * 0.1;

    var svgCal = d3.select('#calendar').append("svg")
        .attr("id", "svg-cal")
        .attr("width", calWidth)
        .attr("height", calHeight)
        .style({
            "padding-top": calPaddingVer
        });

    // data for selected death cause

    var deathMonthData = {};
    for (var m = 1; m <= 12; m++) {
        deathMonthData[m] = {};
        for (var d = 1; d <= 7; d++) {
            deathMonthData[m][d] = [];
        }
    }

    var deathCauseData;
    if (deathCause == 'Heart Disease') {
        deathCauseData = heartDisSel;
    } else if (deathCause == 'Cancer') {
        deathCauseData = cancerSel;
    } else if (deathCause == 'Respiratory Dis.') {
        deathCauseData = respDisSel;
    } else if (deathCause == 'Accidents') {
        deathCauseData = accidentSel;
    } else if (deathCause == 'Stroke') {
        deathCauseData = strokeSel;
    } else if (deathCause == "Alzheimer's") {
        deathCauseData = alzheimerSel;
    } else if (deathCause == 'Diabetes') {
        deathCauseData = diabetesSel;
    } else if (deathCause == 'Flu/Pneumonia') {
        deathCauseData = fluSel;
    }

    deathCauseData.forEach(function(d) {
        deathMonthData[d.MonthOfDeath][d.DayOfWeekOfDeath].push(d);
    });

    // counts for selected death cause

    var deathMonth = 1;
    var deathMonthCount = 0;

    for (var m = 1; m <= 12; m++) {
        var thisMonthCount = 0;
        for (var d = 1; d <= 7; d++) {
            thisMonthCount += deathMonthData[m][d].length;
        }
        if (deathMonthCount < thisMonthCount) {
            deathMonthCount = thisMonthCount;
            deathMonth = m;
        }
    }

    var dayCountMin = deathMonthData[deathMonth][1].length;
    var dayCountMax = deathMonthData[deathMonth][1].length;

    for (var d = 2; d <= 7; d++) {
        var dayCount = deathMonthData[deathMonth][d].length
        if (dayCountMin > dayCount) {
            dayCountMin = dayCount;
        } else if (dayCountMax < dayCount) {
            dayCountMax = dayCount;
        }
    }

    // month display

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var deathMonthLabel = months[deathMonth - 1];

    svgCal.append("text")
        .attr("x", calWidth / 2)
        .attr("y", calPaddingVer)
        .attr("text-anchor", "middle")
        .text(deathMonthLabel)
        .style({
            "font-size": calHeight * 0.13
        });

    // day display

    var days = ["S", "M", "T", "W", "T", "F", "S"];

    var opacityScale = d3.scale.linear().domain([dayCountMin, dayCountMax]).range([0.1, 1]);

    for (var d = 0; d <= 6; d++) {
        svgCal.append("text")
            .attr("x", calPaddingHor + barWidth * d + barWidth / 2)
            .attr("y", calPaddingVer * 2.65)
            .attr("text-anchor", "middle")
            .text(days[d])
            .style({
                "font-size": calHeight * 0.08
            });

        // console.log(calHeight,calPaddingVer,barHeight);

        svgCal.append("rect")
            .attr("height", barHeight)
            .attr("width", barWidth - 2 * barPadding)
            .attr("x", calPaddingHor + barPadding + barWidth * d)
            .attr("y", calHeight - calPaddingVer * 2 - barHeight)
            .style("fill", "#660000")
            .style("fill-opacity", opacityScale(deathMonthData[deathMonth][d + 1].length));
    }

    // opacity scale display

    var calScaleHeight = calHeight * 0.05;

    var svgCalScale = d3.select('#calendar-scale')
        .attr("width", calWidth)
        .style({
            "margin-top": calScaleHeight
        })
        .append("g")
        .attr("id", "svg-cal-scale");

    svgCalScale.append("rect")
        .attr("height", calScaleHeight)
        .attr("width", calWidth)
        .style("fill", "url(#calendar-scale-gradient)");

    svgCalScale.append("text")
        .attr("x", calWidth / 2)
        .attr("y", calScaleHeight * 2.5)
        .attr("text-anchor", "middle")
        .text("# of Deaths")
        .style({
            "font-size": calScaleHeight
        });

    svgCalScale.append("text")
        .attr("x", 0)
        .attr("y", calScaleHeight * 2.5)
        .attr("text-anchor", "start")
        .text(dayCountMin)
        .style({
            "font-size": calScaleHeight
        });

    svgCalScale.append("text")
        .attr("x", calWidth)
        .attr("y", calScaleHeight * 2.5)
        .attr("text-anchor", "end")
        .text(dayCountMax)
        .style({
            "font-size": calScaleHeight
        });
};