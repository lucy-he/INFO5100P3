var age = [1, 114];
var sex = null;
var ethnicity = null;
var education = null;
$('#age li a').on('click', function() {
    $(this).parents("#agegroup").find('.btn').html($(this).text());
    if ($(this).text() == "No Age Preference") {
        age = [1, 114];
    } else {
        age = $(this).text().split(" to ");
        age[0] = parseInt(age[0]);
        age[1] = parseInt(age[1]);
    }
    change(age, sex, ethnicity, education);
});
$('#sex li a').on('click', function() {
    $(this).parents("#sexgroup").find('.btn').html($(this).text());
    if ($(this).text() == "No Gender Preference") {
        sex = null;
    } else if ($(this).text() == "Male") {
        sex = "M";
    } else if ($(this).text() == "Female") {
        sex = "F";
    }
    change(age, sex, ethnicity, education);
});
$('#ethnicity li a').on('click', function() {
    $(this).parents("#ethnicitygroup").find('.btn').html($(this).text());
    if ($(this).text() == "No Race Preference") {
        ethnicity = null;
    } else if ($(this).text() == "White") {
        ethnicity = 1;
    } else if ($(this).text() == "Black") {
        ethnicity = 2;
    } else if ($(this).text() == "American Indian") {
        ethnicity = 3;
    } else if ($(this).text() == "Asian or Pacific Islander") {
        ethnicity = 4;
    }
    change(age, sex, ethnicity, education);
});
$('#education li a').on('click', function() {
    $(this).parents("#educationgroup").find('.btn').html($(this).text());
    if ($(this).text() == "No Education Preference") {
        education = null;
    } else if ($(this).text() == "8th Grade or Less") {
        education = 1;
    } else if ($(this).text() == "9th-12th Grade (No Diploma)") {
        education = 2;
    } else if ($(this).text() == "High School Graduate or GED Completed") {
        education = 3;
    } else if ($(this).text() == "Some College Credit, No Degree") {
        education = 4;
    } else if ($(this).text() == "Associate's Degree") {
        education = 5;
    } else if ($(this).text() == "Bachelor's Degree") {
        education = 6;
    } else if ($(this).text() == "Master's Degree") {
        education = 7;
    } else if ($(this).text() == "PhD Degree") {
        education = 8;
    }
    change(age, sex, ethnicity, education);
});

var data;
var change;
var sliceArr;
var arcPath;

//arrays to hold data for top 8 causes of death
var heartDis = [];
var cancer = [];
var respDis = [];
var accident = [];
var stroke = [];
var alzheimer = [];
var diabetes = [];
var flu = [];

//arrays to hold filtered causes of death
var heartDisSel = heartDis;
var cancerSel = cancer;
var respDisSel = respDis;
var accidentSel = accident;
var strokeSel = stroke;
var alzheimerSel = alzheimer;
var diabetesSel = diabetes;
var fluSel = flu;

d3.csv("csv/DeathRecordsFinal.csv", function(deaths) {
//load and parse data into arrays
deaths.forEach(function(d) {
    if (d.Icd10Code[0] == "I" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 1) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 52)
    ) {
        heartDis.push(d);
    } else if (d.Icd10Code[0] == "C" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 0) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 97)
    ) {
        cancer.push(d);
    } else if (d.Icd10Code[0] == "J" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 40) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 47)
    ) {
        respDis.push(d);
    } else if ((d.Icd10Code[0] == "V") || (d.Icd10Code[0] == "W") || (d.Icd10Code[0] == "X" && (parseInt(d.Icd10Code.slice(1, 3)) <= 59))) {
        accident.push(d);
    } else if (d.Icd10Code[0] == "I" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 60) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 69)
    ) {
        stroke.push(d);
    } else if (d.Icd10Code[0] == "G" &&
        (parseInt(d.Icd10Code.slice(1, 3)) == 30)
    ) {
        alzheimer.push(d);
    } else if (d.Icd10Code[0] == "E" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 10) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 14)
    ) {
        diabetes.push(d);
    } else if (d.Icd10Code[0] == "J" &&
        (parseInt(d.Icd10Code.slice(1, 3)) >= 9) &&
        (parseInt(d.Icd10Code.slice(1, 3)) <= 18)
    ) {
        flu.push(d);
    }
});

//object to hold data for wheel slices
data = [{
    "label": "Heart Disease",
    "value": heartDis.length
}, {
    "label": "Cancer",
    "value": cancer.length
}, {
    "label": "Respiratory Dis.",
    "value": respDis.length
}, {
    "label": "Accidents",
    "value": accident.length
}, {
    "label": "Stroke",
    "value": stroke.length
}, {
    "label": "Alzheimer's",
    "value": alzheimer.length
}, {
    "label": "Diabetes",
    "value": diabetes.length
}, {
    "label": "Flu/Pneumonia",
    "value": flu.length
}];

function updateSliceArr() {
    //populate slice array according to data
    sliceArr = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].value; j++) {
            sliceArr.push(data[i].label);
        }
    }
    sliceArr.reverse();
}
updateSliceArr();

var padding = {
        top: 20,
        right: 40,
        bottom: 20
    },
    w = parseInt(d3.select('#chart').style('width'), 10),
    w = w - padding.right,
    h = parseInt(d3.select('#chart').style('height'), 10),
    h = h - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    picked = 0,
    color = d3.scale.ordinal()
    .range(["#660000", "#843232", "#934c4c", "#a36666", "#c19999", "#d1b2b2", "#e0cccc", "#efe5e5"]);

// declare an arc generator function
var arc = d3.svg.arc()
    .outerRadius(r)
    .innerRadius(30);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var svg = d3.select('#chart').append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox', '0 20 ' + Math.min(w, h) + ' ' + Math.min(w, h))
    .attr('preserveAspectRatio', 'xMinYMin');

var container = svg.append("g")
    .attr("transform", "translate(" + (w / 2) + "," + (h / 2 + padding.top) + ")");

// select paths, use arc generator to draw
var arcs = container.selectAll("g.slice")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "slice");

arcPath = arcs.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path");

arcPath
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc)
    .each(function(d) {
        this._current = d;
    });

// add the text
var arcText = arcs.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text");

arcText
    .attr("transform", function(d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
    .attr("text-anchor", "end")
    .attr("class", "unselectable glow")
    .text(function(d, i) {
        var totNum = heartDisSel.length + cancerSel.length + respDisSel.length + fluSel.length + diabetesSel.length + accidentSel.length + alzheimerSel.length + strokeSel.length;
        //only have text if slice > 1%
        if (data[i].value > (.01 * totNum)) {
            return data[i].label + ' ' + d3.round(100 * data[i].value / totNum) + '%';
        }
    })
    .style("font-size", "9px").style("fill","black").style("stroke","black").style("stroke-width",".5px");


//make arrow
var arrow = svg.append("g")
    .attr("transform", "translate(" + (w / 2) + "," + 15 + ") rotate(270) ")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({
        "fill": "black"
    });

//update wheel based on selected attributes
change = function(age, sex, ethnicity, education) {

    //clear filtered arrays
    heartDisSel = [];
    cancerSel = [];
    respDisSel = [];
    accidentSel = [];
    strokeSel = [];
    alzheimerSel = [];
    diabetesSel = [];
    fluSel = [];

    data[0].value = 0;
    data[1].value = 0;
    data[2].value = 0;
    data[3].value = 0;
    data[4].value = 0;
    data[5].value = 0;
    data[6].value = 0;
    data[7].value = 0;

    //refill arrays based on attributes
    heartDis.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[0].value += 1;
            heartDisSel.push(d);
        }
    });
    cancer.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[1].value += 1;
            cancerSel.push(d);
        }
    });
    respDis.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[2].value += 1;
            respDisSel.push(d);
        }
    });
    accident.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[3].value += 1;
            accidentSel.push(d);
        }
    });
    stroke.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[4].value += 1;
            strokeSel.push(d);
        }
    });
    alzheimer.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[5].value += 1;
            alzheimerSel.push(d);
        }
    });
    diabetes.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[6].value += 1;
            diabetesSel.push(d);
        }
    });
    flu.forEach(function(d) {
        if ((d.Sex == sex || sex == null) &&
            ((d.Age >= age[0] && d.Age <= age[1])) &&
            (d.Education2003Revision == education || education == null) &&
            (d.RaceRecode5 == ethnicity || ethnicity == null)
        ) {
            data[7].value += 1;
            fluSel.push(d);
        }
    });

    //update wheel, arc text based on new data
    arcs.data(pie(data));
    arcPath.data(pie(data));
    arcPath.transition().attrTween("d", arcTween);
    arcText.data(pie(data));
    arcText.transition().attr("transform", function(d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    });
    arcText.text(function(d, i) {
        var totNum = heartDisSel.length + cancerSel.length + respDisSel.length + fluSel.length + diabetesSel.length + accidentSel.length + alzheimerSel.length + strokeSel.length;
        //only have text if slice > 1%
        if (data[i].value > (.01 * totNum)) {
            return data[i].label + ' ' + d3.round(100 * data[i].value / totNum) + '%';
        }
    });
    updateSliceArr();

    //display cause of death
    picked = Math.floor(((angleDeg % 360) / 360) * sliceArr.length);
    d3.select("#question h1")
        .text(sliceArr[picked]);

    //if no data, display warning message
    var totNum = heartDisSel.length + cancerSel.length + respDisSel.length + fluSel.length + diabetesSel.length + accidentSel.length + alzheimerSel.length + strokeSel.length;
    if (totNum == 0) {
        spinText.text('No Data Found');
        arrow.attr('visibility', 'hidden');
    } else {
        spinText.text('SPIN');
        arrow.attr('visibility', 'visible');
    }

    updateCalendar(sliceArr[picked]);
};

//smooth transition of arc data changing
function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    }
}

var isDown = false;
var lastX = w / 2;
var lastY = h / 2;
var curAngle = 0;
var finishAngle = 0;
var angleDeg = 0;

//drag functions to calculate angles during mouse/touch
function dragInit(x, y) {
    isDown = true;
    curAngle = Math.atan2(y, x);
    if (curAngle < 0) {
        curAngle += 2 * Math.PI;
    }
    curAngle = curAngle * 180 / Math.PI;
}

function dragCalc(x, y) {
    if (isDown) {
        x += $('#chart')[0].getBoundingClientRect().left;
        y += $('#chart')[0].getBoundingClientRect().top;
        angleDeg = Math.atan2(y, x);
        if (angleDeg < 0) angleDeg += 2 * Math.PI;
        angleDeg = angleDeg * 180 / Math.PI;
        angleDeg = angleDeg - curAngle + finishAngle;
        if (angleDeg < 0) angleDeg += 360;

        //spin image
        container.attr("transform", "translate(" + (w / 2) + "," + (h / 2 + padding.top) + ") rotate(" + angleDeg + "," + 0 + "," + 0 + ")");

        //display cause of death
        picked = Math.floor(((angleDeg % 360) / 360) * sliceArr.length);
        d3.select("#question h1")
            .text(sliceArr[picked]);

        updateCalendar(sliceArr[picked]);
    }
}

function dragEnd() {
    finishAngle = angleDeg % 360;
    oldrotation = angleDeg % 360;
    isDown = false;
}

//map x,y of mouse clicks to functions
container.on("mousedown", function(d) {
    var thisX = lastX - d3.event.x;
    var thisY = lastY - d3.event.y;
    dragInit(thisX, thisY);
});
container.on("mousemove", function(d) {
    var thisX = lastX - d3.event.x;
    var thisY = lastY - d3.event.y;
    dragCalc(thisX, thisY);
});
container.on("mouseup", function(d) {
    dragEnd();
});

//map x,y of screen touches to functions
container.on("touchstart", function(d) {
    var thisX = lastX - parseInt(d3.event.touches[0].clientX);
    var thisY = lastY - parseInt(d3.event.touches[0].clientY);
    dragInit(thisX, thisY);
});
container.on("touchmove", function(d) {
    d3.event.preventDefault();
    var thisX = lastX - parseInt(d3.event.touches[0].clientX);
    var thisY = lastY - parseInt(d3.event.touches[0].clientY);
    dragCalc(thisX, thisY);
});
container.on("touchend", function(d) {
    dragEnd();
});


//draw spin circle
var spinButt = container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("class", "spin-button")
    .attr("r", 30)
    .style({
        "fill": "white",
        "cursor": "pointer"
    });
spinButt.on("click", spin);

//spin text
var spinText = svg.append("text")
    .attr("x", w / 2)
    .attr("y", h / 2 + padding.top)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .attr("class", "unselectable")
    .style({
        "font-weight": "bold",
        "font-size": "15px"
    });

var oldrotation = 0;

//random spin function
function spin(d) {
    angleDeg = Math.floor(Math.random() * 360) + 720;

    container.transition().duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function() {
            oldrotation = angleDeg;
            //display cause of death
            picked = Math.floor((((angleDeg) % 360) / 360) * sliceArr.length);
            d3.select("#question h1")
                .text(sliceArr[picked]);
            updateCalendar(sliceArr[picked]);
        });
    finishAngle = (angleDeg) % 360;
}

//smoothen random spinning 
function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, (angleDeg));
    return function(t) {
        return "translate(" + (w / 2) + "," + (h / 2 + padding.top) + ") rotate(" + i(t) + ")";
    };
}

spin();

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
        .attr("height",50)
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
    }
});