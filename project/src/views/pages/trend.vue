<template>
    <div>
        <h3>ScatterPlot Here!</h3>
    </div>
</template>

<style scoped>
    body {
    margin: 0;
    }
    .column {
    float: left;
    padding: 10px;
    }

    .column.side {
    width: 50%;
    height: 55%;
    }

    .column.middle {
    width: 50%;
    height: 55%;
    }
    .bottombar{
        width: 100%;
        height: 25%;
    }
    .card {
    background-color: white;
    padding: 5px;
    margin-top: 5px;
    }

    .row:after {
    content: "";
    display: table;
    clear: both;
    }
@media screen and (max-width: 600px) {
  .column.side, .column.middle {
    width: 100%;
  }
}
</style>