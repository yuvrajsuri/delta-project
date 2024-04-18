const Listing = require("../Models/listings");
const ExpressError = require("../utils/ExpressError.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });
const Book = require("../Models/book.js");


//INDEX ROUTE
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

//NEW ROUTE
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

//SHOW ROUTE
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate(
        {path : "reviews", 
        populate:{ path : "author"},})
        .populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you requested for, does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

//CREATE ROUTE
module.exports.createListing = async (req,res)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    // let {title,description,price,country,location}=req.body;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing =  await newlisting.save();
    console.log(savedListing);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

//EDIT ROUTE
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for, does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");

    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

//UPDATE ROUTE
module.exports.updateListing = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.bookListing = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);

    res.render("booking/booklisting.ejs",{listing});
}

module.exports.payListing = async (req,res)=>{    
    // let {id} = req.params;
    let newBooking = new Book(req.body.book);
    
    console.log(req.body.book)
    await newBooking.save();
    res.render("booking/payment.ejs");
}

// Define the GET handler for /payroute
module.exports.getPayRoute = async (req, res) => {
    // Render the payment page
    res.render("booking/payment.ejs");
};

// Define the POST handler for /payroute
module.exports.postPayRoute = async (req, res) => {
    // Handle payment logic here
    
    // Redirect to /listings after payment
    // res.send("done");
    req.flash("success","Payment Done successfully!");

    res.redirect("/listings");
};



//destroy route
module.exports.destroyListing = async (req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};

//module.exports.payroute = async (req,res)=>{
//     // let {id}= req.params;
//     // const listing = await Listing.findById(id);

//     res.render("booking/payment.ejs");
// }

// module.exports.payroute = async (req,res)=>{
//     // let {id}= req.params;
//     // const listing = await Listing.findById(id);

//     res.redirect("/listings");
// }