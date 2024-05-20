
async function runtask() {
    props.navigation.navigate('Home');
    for (const action of pendingActions) {
        const result = await new Promise(async (resolve) => {
          
            setTimeout(() => {
                resolve(`Task ${action.name} completed`);
            }, 1000);
        });
        console.log(result);
    }
}