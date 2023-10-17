console.log('First Console');

function fakeSetTimeout(callback, delay) {
    //callback();
   setTimeout(callback, delay*1000);
}

console.log('Second Console');

fakeSetTimeout(function() {
    console.log('Third Console');
}, 3);

console.log('Fourth Console');

