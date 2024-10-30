import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = Stripe('sk_test_51PDttXSIPJlXUMpCpHDQ0KPN8oMWsjwIQ023GvwRmQFO67BCbGLXEE8SlPVQzIDgJgf4umGjj7D8ds5Y8Yj8U5sn00gWCaO0e1');

const createInvoice = async () => {
    const fixedAmount = 50000; // Fixed amount in paise (smallest currency unit)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Appointment Fee',
                },
                unit_amount: fixedAmount,  // Amount in the smallest currency unit
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}?payment=success`,
        cancel_url: `${process.env.FRONTEND_URL}?payment=canceled`,
    });
    return {
        order_id: session.id,  // Use Stripe's session ID as order ID
        session_id: session.id,
        amount: session.amount_total,
        datalink: session.url,
    };
};

export const postAppointment = async (req, res, next) => {
        const {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor_firstName,
            doctor_lastName,
            hasVisited,
            address,
        } = req.body;
    
        if (!firstName ||
            !lastName ||
            !email ||
            !phone ||
            !nic ||
            !dob ||
            !gender ||
            !appointment_date ||
            !department ||
            !doctor_firstName ||
            !doctor_lastName ||
            !address) {
            return next(new ErrorHandler("Please Fill Full Form!", 400));
        }
    
        const isConflict=await User.find({
            firstName: doctor_firstName,
            lastName: doctor_lastName,
            role: "Doctor",
            doctorDepartment: department
        })
    
        if(isConflict.length===0){
            return next(new ErrorHandler("Doctor Not Found!",404));
        }
        if(isConflict.length>1){
            return next(new ErrorHandler("Doctors Conflict! Please Contact Through Email or Phone!",404));
        }
    
        const doctorId=isConflict[0]._id;
    const patientId=req.user._id;
    
        const appointment = await Appointment.create({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            appointment_date,
            department,
            doctor: {
                firstName: doctor_firstName,
                lastName: doctor_lastName,
            },
            hasVisited,
            address,
            doctorId,
            patientId,
        });
    
        const invoice = await createInvoice();
    
        res.status(200).json({
            success: true,
            message: "Appointment Sent Successfully!",
            sessionId: invoice.session_id,
            orderId: invoice.order_id,
            data_link: invoice.datalink,
        });
    
};

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Appointment Status Updated",
        appointment,
    });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment Deleted!",
    });
});
