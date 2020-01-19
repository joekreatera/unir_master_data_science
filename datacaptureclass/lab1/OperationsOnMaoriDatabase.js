function q2(){
    
    db.LEED_worker_turnover_rates_quarterly.find().forEach((it)=> { 
        var newField = {
           Maori_authority_worker_turnover_rate:it.Maori_authority_worker_turnover_rate,
            Maori_SME_worker_turnover_rate:it.Maori_SME_worker_turnover_rate,
            Maori_tourism_worker_turnover_rate:it.Maori_tourism_worker_turnover_rate
        };
        
        db.LEED_worker_turnover_rates_quarterly.update({_id:it._id}, 
            {$set:
                {turnover_rate:newField}
            } 
        )
    });
    
    return  db.LEED_worker_turnover_rates_quarterly.find();
    
}

function q3(){
    
    db.LEED_worker_turnover_rates_quarterly.update({} , { $unset: { 
    "Maori_authority_worker_turnover_rate":0,
    "Maori_SME_worker_turnover_rate":0,
    "Maori_tourism_worker_turnover_rate":0
    } } , {multi:true});

    return  db.LEED_worker_turnover_rates_quarterly.find();
}

function q4(){
    
    db.Agriculture_horticulture_information_for_Maori_farms_annual.find().forEach((it)=> { 
      var kw = ""+(it.Kiwifruit);
      var av = ""+ (it.Avocados);
      var wg = ""+ (it.Wine_grapes);
      var ons = ""+ (it.Onions);
      var sq =  ""+ (it.Squash);
      db.Agriculture_horticulture_information_for_Maori_farms_annual.update({_id:it._id},{$set: {
        Kiwifruit:kw,
        Avocados:av,
        Wine_grapes:wg,
        Onios:ons,
        Squash:sq
      }});
    });

   
    
    db.Agriculture_horticulture_information_for_Maori_farms_annual.find().forEach((it)=> { 
      var kw = Number(it.Kiwifruit);
      var av = Number(it.Avocados);
      var wg = Number(it.Wine_grapes);
      var ons = Number(it.Onions);
      var sq = Number(it.Squash);
      db.Agriculture_horticulture_information_for_Maori_farms_annual.update({_id:it._id},{$set: {
        Kiwifruit:kw,
        Avocados:av,
        Wine_grapes:wg,
        Onios:ons,
        Squash:sq
      }});
});


    return ( db.Agriculture_horticulture_information_for_Maori_farms_annual.find()) ;
    
}

function q5(){
    
   return db.Business_operations_rates_activities_annual.find(
{Type:"Maori_tourism" , 
 Tourism_percent:{$gt:80} });

}

function q6(){
    
        var res = db.Busines_demography_enterprises_for_Maori_authorities_annual.aggregate([
            { $match: {Industry: {$ne: "Total"} }},
             { $group: { _id:null, sum: {$sum: "$Enterprises"}   }}
        ]);
    // get all the documents that are equal to “TOTAL”. Decided like this instead of find to integrate all Total rows that could be inside de collection
    var resT = db.Busines_demography_enterprises_for_Maori_authorities_annual.aggregate([
             {$match: {Industry:{$eq: "Total"}}} , 
             { $group: { _id:null, sum: {$sum: "$Enterprises"}   }}
        ]);
        
    
    var tot1 = 0;
    while( res.hasNext() ){
        var r = res.next();
        console.log(r);
        // should have only one result
        tot1 = r.sum;
    }
    
    var tot2 = 0;
    while( resT.hasNext() ){
        var r = resT.next();
        console.log(r);
        tot2 = r.sum;
    }
    
    if (tot1 != tot2){
        console.log("They're NOT equal");
    }else{
        console.log("They ARE equal");
    }

}

function q7(){
    
    db.Business_demography_enterprises_for_Maori_authorities_annual.aggregate(
    [
        {$match: {}},
        {$merge: { into: "Business_demography_enterprises"}}
    ]
    );
    
    db.Business_demography_enterprises_for_Maori_SMEs_annual.aggregate(
        [
            {$match: {}},
            {$merge: { into: "Business_demography_enterprises"}}
        ]
    );
    
    console.log("Equal=" +(db.Busines_demography_enterprises_for_Maori_authorities_annual.count() + db.Business_demography_enterprises_for_Maori_SMEs_annual.count() ==  db.Business_demography_enterprises.count() ) );

    return db.Business_demography_enterprises.find({});
}



function q8(){
    
    var res = db.Business_demography_enterprises.aggregate([
    {$match: {Industry:"Total"}},
    {$group: { _id: null, employee_sum:{$sum: "$EmployeeCount" }}}
    ]);

    var r = res.next();
    
// detail
    /*
    var res2 = db.Business_demography_enterprises.aggregate([
        {$match: {}},
        {$group: { _id: "$Industry", employee_sum:{$sum: "$EmployeeCount" }}}
        ]);
    */
    
     var res2 = db.Business_demography_enterprises.aggregate([
    {$match: {Industry:{$ne: "Total"}  }},
    {$group: { _id: null, employee_sum:{$sum: "$EmployeeCount" }}}
    ]);

    
    var r2 = res2.next();
    console.log("Not equal " + r.employee_sum + " != " + r2.employee_sum );
    return r.employee_sum;

}

function q9(){
    
    return db.LEED_estimates_of_filled_jobs_quarterly.find( {Maori_SME_filled_jobs:{$eq:7780.00 }} ).pretty();
}

function q10(){
    
    return db["Agriculture_land-use_information_for_Maori_farms_annual"].find( {"Year":{$ne: 2017}}).projection({"_id":0,"Year":1,"Horticulture":1});
    
}

/*

To use this file:
Uncomment the line you want to execute.


WARNING: some of them require previous steps that have already been made. 
Check documentation to analyze that these are function designed to be executed in order after loading from scratch the database using converter tool on node.js

*/

//q2();
//q3();
//q4();
//q5();
//q6();
//q7();
//q8();
//q9();
//q10();